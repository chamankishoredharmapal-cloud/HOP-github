# Phase 3 — Inventory Integrity & Concurrency Audit

**Audit Timestamp**: 2026-08-16T05:29:00+05:30  

---

## 1. Inventory Locking & Concurrency Control

- **Pessimistic Row Locking (`SELECT ... FOR UPDATE`)**:
  - In `confirm_paid_order` RPC:
    ```sql
    FOR v_item IN SELECT product_id::UUID AS pid, quantity FROM order_items WHERE order_id = v_order_id LOOP
      SELECT stock INTO v_prev_stock FROM products WHERE id = v_item.pid FOR UPDATE;
      IF v_prev_stock IS NOT NULL THEN
        v_new_stock := GREATEST(0, v_prev_stock - v_item.quantity);
        UPDATE products SET stock = v_new_stock WHERE id = v_item.pid;
        INSERT INTO inventory_history (product_id, change, previous_stock, new_stock, reason, notes)
        VALUES (v_item.pid, -v_item.quantity, v_prev_stock, v_new_stock, 'sale', 'Order ' || v_order_id || ' — payment verified');
      END IF;
    END LOOP;
    ```
  - In `adjust_product_stock` RPC:
    ```sql
    SELECT stock INTO v_previous_stock FROM products WHERE id = p_product_id FOR UPDATE;
    ```

- **Non-Negative Stock Database Constraint**:
  - `ALTER TABLE products ADD CONSTRAINT products_stock_non_negative CHECK (stock >= 0);`
  - Guarantees that even in edge cases of concurrent adjustment, stock cannot fall below zero.

---

## 2. Inventory Audit Trail (`inventory_history`)

- Every stock change is permanently logged to `inventory_history` with:
  - `change` (positive/negative integer)
  - `previous_stock`
  - `new_stock`
  - `reason` (`'sale'`, `'release'`, `'manual_adjustment'`, `'restock'`)
  - `notes` (references order ID or admin note)
  - `created_at` timestamp
- Protected by strict admin RLS policy (`public.is_admin()`).
