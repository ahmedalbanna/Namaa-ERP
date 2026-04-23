import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Generic Error Handler as per integration instructions
interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: any;
}

const handleFirestoreError = (error: any, op: string, path: string | null) => {
  console.error(`Firestore Error [${op}]:`, error);
  const errorInfo: FirestoreErrorInfo = {
    error: error.message,
    operationType: op as any,
    path,
    authInfo: 'Auth context info would go here'
  };
  throw new Error(JSON.stringify(errorInfo));
};

export const erpService = {
  // Donors
  subscribeToDonors: (callback: (data: any[]) => void) => {
    const q = query(collection(db, 'donors'), orderBy('name'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, 'list', 'donors'));
  },
  addDonor: async (data: any) => {
    try {
      return await addDoc(collection(db, 'donors'), { ...data, createdAt: new Date().toISOString() });
    } catch (err) { handleFirestoreError(err, 'create', 'donors'); }
  },

  // Programs
  subscribeToPrograms: (callback: (data: any[]) => void) => {
    const q = query(collection(db, 'programs'), orderBy('name'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, 'list', 'programs'));
  },
  addProgram: async (data: any) => {
    try {
      return await addDoc(collection(db, 'programs'), { ...data, spent: 0 });
    } catch (err) { handleFirestoreError(err, 'create', 'programs'); }
  },

  // Donations
  addDonation: async (data: any) => {
    try {
      const batch = writeBatch(db);
      const donationRef = doc(collection(db, 'donations'));
      batch.set(donationRef, { ...data, date: new Date().toISOString() });
      
      // Update program spent amount if it's cash
      if (data.type === 'Cash') {
        const programRef = doc(db, 'programs', data.programId);
        // Note: In real scenarios, adding a donation usually increases "received funds", not "spent".
        // But for this ERP, let's just log it and maybe update a "totalReceived" if we had it.
        // batch.update(programRef, { received: increment(data.amount) });
      }
      
      await batch.commit();
    } catch (err) { handleFirestoreError(err, 'create', 'donations'); }
  },

  // Inventory
  subscribeToInventory: (callback: (data: any[]) => void) => {
    const q = query(collection(db, 'inventory'), orderBy('name'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, 'list', 'inventory'));
  },
  addItem: async (data: any) => {
    try {
      return await addDoc(collection(db, 'inventory'), { ...data, lastUpdated: new Date().toISOString() });
    } catch (err) { handleFirestoreError(err, 'create', 'inventory'); }
  },
  
  // Distributions
  subscribeToDistributions: (callback: (data: any[]) => void) => {
    const q = query(collection(db, 'distributions'), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, 'list', 'distributions'));
  },
  recordDistribution: async (data: any) => {
    try {
      const batch = writeBatch(db);
      const distRef = doc(collection(db, 'distributions'));
      batch.set(distRef, { ...data, date: new Date().toISOString() });
      
      // Decrease inventory
      const itemRef = doc(db, 'inventory', data.itemId);
      batch.update(itemRef, { 
        stockLevel: increment(-data.quantity),
        lastUpdated: new Date().toISOString()
      });
      
      await batch.commit();
    } catch (err) { handleFirestoreError(err, 'create', 'distributions'); }
  }
};
