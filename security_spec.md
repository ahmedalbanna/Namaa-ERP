# Security Specification for Namaa ERP

## 1. Data Invariants
- No donation can be recorded without a valid donor and assigned program.
- Inventory levels cannot be negative.
- A donation amount must be greater than zero.
- Distributions must refer to an existing program and inventory item.
- Only admins can modify inventory stock baseline (initial stock).
- Users can only read data if they are authenticated and authorized as staff/admins.
- PII (donor contacts) must be protected.

## 2. The "Dirty Dozen" Payloads (Deny Test Cases)

1.  **Identity Spoofing**: Attempt to create a donation where `donorId` does not match the authenticated user (if users could donate themselves) or unauthorized creation.
2.  **Schema Violation**: Create a program with a string as `budget`.
3.  **Positive Integrity**: Create a donation with `amount: -500`.
4.  **Positive Integrity**: Create a distribution with `quantity: -10`.
5.  **Relational Orphan**: Create a distribution with a non-existent `programId`.
6.  **Immutable Breach**: Attempt to change `createdAt` on a donor profile.
7.  **Unverified Write**: Attempt to create any document without `email_verified == true`.
8.  **Privilege Escalation**: Non-admin user attempting to create/modify an entry in the `/admins/` collection.
9.  **Massive Payload**: Attempt to inject a 1MB string into the `beneficiaryName` field.
10. **State Corruption**: Attempt to update a program's `spent` amount to be higher than `budget` without admin approval (if logic is enforced in rules).
11. **PII Leak**: Non-admin user attempting to list ALL donors including their private emails/phones.
12. **Status Locking**: Attempt to change a program from `Completed` back to `Planned`.

## 3. The Test Runner
(This is a conceptual representation for `firestore.rules.test.ts`)
```ts
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

// Test Cases for the "Dirty Dozen"
// 1. Unverified user creation failure
// 2. Negative amount donation failure
// 3. ID Poisoning (too long) failure
// ... etc
```
