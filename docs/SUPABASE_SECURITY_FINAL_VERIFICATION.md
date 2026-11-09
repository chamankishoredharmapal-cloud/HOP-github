# Supabase Security Final Verification — HOP

## Runtime tests executed (staging project, disposable users, cleaned up)

TEST 1 (User A own address insert): PASS — 200
TEST 2 (User A spoof User B customer_id): PASS — 403
TEST 3 (User B own address insert): PASS — 200
TEST 4 (User A reads addresses): PASS — count 1
TEST 5 (User A updates User B address): PASS — 0 rows affected
TEST 6 (User A owner transfer): PASS — 403
TEST 7 (User A deletes User B address): PASS — 0 rows affected
TEST 8 (User A deletes own address): PASS — 200
TEST 9 (Normal user admin read settings): PASS — 0 rows (filtered)
TEST 10 (Admin read settings): PASS — rows visible
TEST 11 (Normal user admin write settings): PASS — 403
TEST 12 (Admin write settings): PASS — 200
TEST 13 (create-razorpay-order anon): PASS — 401
TEST 14 (create-razorpay-order user empty): PASS — 400
TEST 15 (mark-delivery-paid anon): PASS — 401
TEST 16 (mark-delivery-paid user): PASS — 403
TEST 17 (razorpay-webhook anon): PASS — 400
TEST 18 (draft image anon): PASS — 0 rows

## Storage
- Buckets: product-images (public), HOP-films (public). No private buckets.
- Draft image object direct access: NOT VERIFIED (bucket public; potential MEDIUM risk).

## Production runtime verification
- NOT VERIFIED on production (tests executed on staging). Production policies assumed same via migrations.

## Final status
READY FOR PHASE 3
