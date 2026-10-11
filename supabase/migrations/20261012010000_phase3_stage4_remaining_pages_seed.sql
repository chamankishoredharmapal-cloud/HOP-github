-- =============================================================================
-- House of Padmavati — Phase 3, Stage 4: Remaining Pages & Policies Baseline Seed
-- Migration: 20261012010000_phase3_stage4_remaining_pages_seed.sql
--
-- Implements:
--   1. Baseline records in public.site_sections for:
--      - about.story (The House Story)
--      - care.info (Customer Care Correspondence & Information)
--      - policy.shipping (Shipping Policy)
--      - policy.returns (Returns & Refund Policy)
--      - policy.privacy (Privacy Policy)
--      - policy.terms (Terms & Conditions)
--   2. Revision #1 in public.site_section_revisions for each seeded section
--   3. Idempotent execution via ON CONFLICT (key) DO NOTHING
-- =============================================================================

INSERT INTO public.site_sections (
  key,
  page_name,
  section_type,
  display_name,
  version,
  draft_payload,
  published_payload,
  status,
  has_unpublished_changes
) VALUES
  (
    'about.story',
    'about',
    'story',
    'The House (Our Story)',
    1,
    '{
      "header_title": "The House.",
      "header_subtitle": "A digital fashion house for Indian sarees.",
      "heading": "House of Padmavati",
      "story_title": "House of Padmavati is named for a real woman.",
      "story_content": "We curate the Indian saree for the modern wardrobe. Our collections are designed not as seasonal trends, but as enduring expressions of identity.",
      "image_url": "/content/weaver-portrait/gangamma-molakalmuru/hero.jpg",
      "image_alt": "House of Padmavati - The House",
      "image_position": "left"
    }'::jsonb,
    '{
      "header_title": "The House.",
      "header_subtitle": "A digital fashion house for Indian sarees.",
      "heading": "House of Padmavati",
      "story_title": "House of Padmavati is named for a real woman.",
      "story_content": "We curate the Indian saree for the modern wardrobe. Our collections are designed not as seasonal trends, but as enduring expressions of identity.",
      "image_url": "/content/weaver-portrait/gangamma-molakalmuru/hero.jpg",
      "image_alt": "House of Padmavati - The House",
      "image_position": "left"
    }'::jsonb,
    'published',
    false
  ),
  (
    'care.info',
    'care',
    'custom_section',
    'Customer Care Info',
    1,
    '{
      "header_title": "Customer Care.",
      "header_subtitle": "We are here to assist you.",
      "intro_heading": "Write to the House",
      "intro_text": "We welcome your thoughts and questions. Please leave a message below, and we will respond with care.",
      "response_time_note": "We have received your message and will reply within two business days.",
      "email_address": "houseofpadmavati@gmail.com"
    }'::jsonb,
    '{
      "header_title": "Customer Care.",
      "header_subtitle": "We are here to assist you.",
      "intro_heading": "Write to the House",
      "intro_text": "We welcome your thoughts and questions. Please leave a message below, and we will respond with care.",
      "response_time_note": "We have received your message and will reply within two business days.",
      "email_address": "houseofpadmavati@gmail.com"
    }'::jsonb,
    'published',
    false
  ),
  (
    'policy.shipping',
    'policy',
    'policy_document',
    'Shipping Policy',
    1,
    '{
      "title": "Shipping",
      "last_updated": "October 2026",
      "meta_description": "Shipping policy for House of Padmavati — delivery timelines, charges, courier partners, and coverage areas.",
      "contact_email": "houseofpadmavati@gmail.com",
      "contact_business": "House of Padmavati, Bangalore, India",
      "sections": [
        {
          "id": "1",
          "title": "1. Shipping Coverage",
          "content": "We ship to all locations within India. We do not currently offer international shipping."
        },
        {
          "id": "2",
          "title": "2. Shipping Charges",
          "content": "Free Shipping: Your first qualifying successful order ships free.\nStandard Shipping: A flat ₹99 is charged for all other orders.\n\nThe first-order free delivery benefit is applied automatically at checkout for eligible customers based on normalised phone number and email address. The benefit is consumed by the first qualifying successful order."
        },
        {
          "id": "3",
          "title": "3. Dispatch Timeline",
          "content": "Orders are dispatched within 1 business day of order confirmation and payment verification."
        },
        {
          "id": "4",
          "title": "4. Delivery Timelines",
          "content": "Domestic (India): 3 – 5 business days from the date of dispatch.\n\nDelivery timelines are estimates and are not guaranteed. Delays may occur due to unforeseen circumstances such as weather conditions, courier partner operational issues, or customs processing."
        },
        {
          "id": "5",
          "title": "5. Courier Partners",
          "content": "We ship through the following courier partners:\nDomestic: Delhivery, Blue Dart, DTDC\n\nThe courier partner for your order will be determined based on the delivery location and service availability. Tracking information will be shared with you once the order is dispatched."
        },
        {
          "id": "6",
          "title": "6. Delivery Instructions",
          "content": "A signature is required only for high-value orders to ensure secure delivery.\nDeliveries are not made to PO Box addresses.\nAll shipments are insured against loss and transit damage."
        },
        {
          "id": "7",
          "title": "7. Order Tracking",
          "content": "Once your order is dispatched, you will receive a shipping confirmation email containing a tracking number and a link to track your shipment."
        },
        {
          "id": "8",
          "title": "8. Undeliverable Packages",
          "content": "If a package is returned to us due to an incorrect address provided by you, failed delivery attempts, or refusal to accept delivery, we will contact you to arrange re-shipment. Additional shipping charges may apply."
        },
        {
          "id": "9",
          "title": "9. Contact",
          "content": "For shipping-related inquiries, please contact us:\nEmail: houseofpadmavati@gmail.com\nBusiness: House of Padmavati, Bangalore, India"
        }
      ]
    }'::jsonb,
    '{
      "title": "Shipping",
      "last_updated": "October 2026",
      "meta_description": "Shipping policy for House of Padmavati — delivery timelines, charges, courier partners, and coverage areas.",
      "contact_email": "houseofpadmavati@gmail.com",
      "contact_business": "House of Padmavati, Bangalore, India",
      "sections": [
        {
          "id": "1",
          "title": "1. Shipping Coverage",
          "content": "We ship to all locations within India. We do not currently offer international shipping."
        },
        {
          "id": "2",
          "title": "2. Shipping Charges",
          "content": "Free Shipping: Your first qualifying successful order ships free.\nStandard Shipping: A flat ₹99 is charged for all other orders.\n\nThe first-order free delivery benefit is applied automatically at checkout for eligible customers based on normalised phone number and email address. The benefit is consumed by the first qualifying successful order."
        },
        {
          "id": "3",
          "title": "3. Dispatch Timeline",
          "content": "Orders are dispatched within 1 business day of order confirmation and payment verification."
        },
        {
          "id": "4",
          "title": "4. Delivery Timelines",
          "content": "Domestic (India): 3 – 5 business days from the date of dispatch.\n\nDelivery timelines are estimates and are not guaranteed. Delays may occur due to unforeseen circumstances such as weather conditions, courier partner operational issues, or customs processing."
        },
        {
          "id": "5",
          "title": "5. Courier Partners",
          "content": "We ship through the following courier partners:\nDomestic: Delhivery, Blue Dart, DTDC\n\nThe courier partner for your order will be determined based on the delivery location and service availability. Tracking information will be shared with you once the order is dispatched."
        },
        {
          "id": "6",
          "title": "6. Delivery Instructions",
          "content": "A signature is required only for high-value orders to ensure secure delivery.\nDeliveries are not made to PO Box addresses.\nAll shipments are insured against loss and transit damage."
        },
        {
          "id": "7",
          "title": "7. Order Tracking",
          "content": "Once your order is dispatched, you will receive a shipping confirmation email containing a tracking number and a link to track your shipment."
        },
        {
          "id": "8",
          "title": "8. Undeliverable Packages",
          "content": "If a package is returned to us due to an incorrect address provided by you, failed delivery attempts, or refusal to accept delivery, we will contact you to arrange re-shipment. Additional shipping charges may apply."
        },
        {
          "id": "9",
          "title": "9. Contact",
          "content": "For shipping-related inquiries, please contact us:\nEmail: houseofpadmavati@gmail.com\nBusiness: House of Padmavati, Bangalore, India"
        }
      ]
    }'::jsonb,
    'published',
    false
  ),
  (
    'policy.returns',
    'policy',
    'policy_document',
    'Returns & Refund Policy',
    1,
    '{
      "title": "Returns & Refund",
      "last_updated": "October 2026",
      "meta_description": "Returns, refund, and replacement policy for House of Padmavati — eligibility windows by order size, conditions, and process.",
      "contact_email": "houseofpadmavati@gmail.com",
      "contact_business": "House of Padmavati, Bangalore, India",
      "sections": [
        {
          "id": "1",
          "title": "1. Return and Replacement Eligibility",
          "content": "Return and replacement eligibility depends on the number of products in your order. The eligibility window is calculated from the date of delivery.\n\n• 1 – 3 products per order: 3 calendar days from delivery\n• More than 3 products per order: 7 calendar days from delivery\n\nRequests submitted after the eligibility window will not be accepted."
        },
        {
          "id": "2",
          "title": "2. Eligible Reasons for Return or Replacement",
          "content": "Returns and replacements are accepted only for the following reasons:\n• Wrong product shipped (different from what was ordered)\n• Product damaged in transit\n• Manufacturing defect in the product\n• Incorrect measurements (applicable only if measurements were taken by House of Padmavati for stitched products)"
        },
        {
          "id": "3",
          "title": "3. Not Eligible for Return or Replacement",
          "content": "The following situations are not eligible for return or replacement:\n• Change of mind\n• Colour variation (actual product colour may differ from screen representation)\n• Ordered by mistake\n• Personal preference or liking\n• Product has been draped once\n• Product has been used, washed, or altered\n• Product damaged after delivery\n• Missing tags or original packaging\n• Clearance or sale items (unless defective)"
        },
        {
          "id": "4",
          "title": "4. Inspection Condition",
          "content": "You may open the package and inspect the product. Unfolding the saree for inspection is permitted and does not void your return eligibility. However, the product must not be worn, draped, washed, altered, or damaged in any way. All original tags and packaging must be intact for the return to be accepted."
        },
        {
          "id": "5",
          "title": "5. How to Initiate a Return or Replacement",
          "content": "To initiate a return or replacement request:\n1. Email us at houseofpadmavati@gmail.com with your order number and reason for return\n2. Share clear photographs or a video showing the issue (for wrong product, damage, or defect)\n3. Include your order number in the subject line\n\nWe will review your request and provide instructions for the return process."
        },
        {
          "id": "6",
          "title": "6. Return Shipping",
          "content": "Return shipping costs will be covered by House of Padmavati for eligible returns (wrong product, transit damage, manufacturing defect, or incorrect measurements)."
        },
        {
          "id": "7",
          "title": "7. Exchange Policy",
          "content": "Exchanges are offered as an alternative to returns at your discretion. The following terms apply:\n• One exchange per product is allowed\n• Shipping charges for voluntary exchanges are borne by the customer\n• Any price difference between the original product and the exchanged product will be payable by you (if higher) or refunded to you (if lower)"
        },
        {
          "id": "8",
          "title": "8. Refund Process",
          "content": "Once we receive and inspect the returned product, we will process your refund. The following terms apply:\n• Refunds are processed to the original payment method used for the order\n• Refunds are processed within 5 – 7 business days after the returned product passes inspection"
        },
        {
          "id": "9",
          "title": "9. Cancellation",
          "content": "Orders can be cancelled within 1 hour of placing the order. No cancellation fee applies. To cancel an order, email us at houseofpadmavati@gmail.com with your order number. Orders cannot be cancelled after 1 hour or after dispatch."
        },
        {
          "id": "10",
          "title": "10. Contact",
          "content": "For any questions about returns, refunds, or exchanges, please contact us:\nEmail: houseofpadmavati@gmail.com\nBusiness: House of Padmavati, Bangalore, India"
        }
      ]
    }'::jsonb,
    '{
      "title": "Returns & Refund",
      "last_updated": "October 2026",
      "meta_description": "Returns, refund, and replacement policy for House of Padmavati — eligibility windows by order size, conditions, and process.",
      "contact_email": "houseofpadmavati@gmail.com",
      "contact_business": "House of Padmavati, Bangalore, India",
      "sections": [
        {
          "id": "1",
          "title": "1. Return and Replacement Eligibility",
          "content": "Return and replacement eligibility depends on the number of products in your order. The eligibility window is calculated from the date of delivery.\n\n• 1 – 3 products per order: 3 calendar days from delivery\n• More than 3 products per order: 7 calendar days from delivery\n\nRequests submitted after the eligibility window will not be accepted."
        },
        {
          "id": "2",
          "title": "2. Eligible Reasons for Return or Replacement",
          "content": "Returns and replacements are accepted only for the following reasons:\n• Wrong product shipped (different from what was ordered)\n• Product damaged in transit\n• Manufacturing defect in the product\n• Incorrect measurements (applicable only if measurements were taken by House of Padmavati for stitched products)"
        },
        {
          "id": "3",
          "title": "3. Not Eligible for Return or Replacement",
          "content": "The following situations are not eligible for return or replacement:\n• Change of mind\n• Colour variation (actual product colour may differ from screen representation)\n• Ordered by mistake\n• Personal preference or liking\n• Product has been draped once\n• Product has been used, washed, or altered\n• Product damaged after delivery\n• Missing tags or original packaging\n• Clearance or sale items (unless defective)"
        },
        {
          "id": "4",
          "title": "4. Inspection Condition",
          "content": "You may open the package and inspect the product. Unfolding the saree for inspection is permitted and does not void your return eligibility. However, the product must not be worn, draped, washed, altered, or damaged in any way. All original tags and packaging must be intact for the return to be accepted."
        },
        {
          "id": "5",
          "title": "5. How to Initiate a Return or Replacement",
          "content": "To initiate a return or replacement request:\n1. Email us at houseofpadmavati@gmail.com with your order number and reason for return\n2. Share clear photographs or a video showing the issue (for wrong product, damage, or defect)\n3. Include your order number in the subject line\n\nWe will review your request and provide instructions for the return process."
        },
        {
          "id": "6",
          "title": "6. Return Shipping",
          "content": "Return shipping costs will be covered by House of Padmavati for eligible returns (wrong product, transit damage, manufacturing defect, or incorrect measurements)."
        },
        {
          "id": "7",
          "title": "7. Exchange Policy",
          "content": "Exchanges are offered as an alternative to returns at your discretion. The following terms apply:\n• One exchange per product is allowed\n• Shipping charges for voluntary exchanges are borne by the customer\n• Any price difference between the original product and the exchanged product will be payable by you (if higher) or refunded to you (if lower)"
        },
        {
          "id": "8",
          "title": "8. Refund Process",
          "content": "Once we receive and inspect the returned product, we will process your refund. The following terms apply:\n• Refunds are processed to the original payment method used for the order\n• Refunds are processed within 5 – 7 business days after the returned product passes inspection"
        },
        {
          "id": "9",
          "title": "9. Cancellation",
          "content": "Orders can be cancelled within 1 hour of placing the order. No cancellation fee applies. To cancel an order, email us at houseofpadmavati@gmail.com with your order number. Orders cannot be cancelled after 1 hour or after dispatch."
        },
        {
          "id": "10",
          "title": "10. Contact",
          "content": "For any questions about returns, refunds, or exchanges, please contact us:\nEmail: houseofpadmavati@gmail.com\nBusiness: House of Padmavati, Bangalore, India"
        }
      ]
    }'::jsonb,
    'published',
    false
  ),
  (
    'policy.privacy',
    'policy',
    'policy_document',
    'Privacy Policy',
    1,
    '{
      "title": "Privacy",
      "last_updated": "October 2026",
      "meta_description": "Privacy policy for House of Padmavati — how we collect, use, and protect your personal information.",
      "contact_email": "houseofpadmavati@gmail.com",
      "contact_business": "House of Padmavati, Bangalore, India",
      "sections": [
        {
          "id": "1",
          "title": "1. Introduction",
          "content": "House of Padmavati respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website or make a purchase.\n\nBy using our website, you agree to the collection and use of information as described in this policy."
        },
        {
          "id": "2",
          "title": "2. Information We Collect",
          "content": "2.1 Personal Information You Provide\nWhen you place an order or create an account, we may collect:\n• Full name\n• Email address\n• Phone number\n• Shipping address\n• Order details\n\n2.2 Information Collected Automatically\nWhen you visit our website, we automatically collect only the following essential data:\n• Authentication tokens (stored in your browser via Supabase) to maintain your session\n• Cart and wishlist contents (stored locally in your browser)\n\nWe do not use Google Analytics, Microsoft Clarity, Meta Pixel, or any other third-party analytics or tracking services. We do not collect device information, IP addresses, or browsing behaviour for analytics purposes."
        },
        {
          "id": "3",
          "title": "3. How We Use Your Information",
          "content": "We use the collected information for the following purposes:\n• Processing and fulfilling orders\n• Communicating with you about your order\n• Providing customer support\n• Sending order updates and shipping confirmations\n• Improving our website and services\n• Complying with legal obligations\n• Preventing fraud and ensuring security"
        },
        {
          "id": "4",
          "title": "4. Third-Party Services We Use",
          "content": "We rely on the following third-party services to operate our website:\n• Supabase – hosting, database, and authentication\n• Razorpay – payment processing\n• Resend – email delivery\n• Cloudflare Pages – website hosting and deployment\n• Google Fonts – typography (fonts loaded from fonts.googleapis.com and fonts.gstatic.com)\n\nThese third-party services have their own privacy policies governing the use of your data. We encourage you to review their policies."
        },
        {
          "id": "5",
          "title": "5. Cookies and Local Storage",
          "content": "Our website uses only essential cookies and local storage:\n• Authentication tokens (via Supabase) — stored in localStorage to keep you signed in\n• Cart contents — stored in localStorage to persist your bag across sessions\n• Wishlist contents — stored in localStorage to persist your saved items\n\nWe do not use tracking cookies, advertising cookies, or analytics cookies. You can control or clear local storage and cookies through your browser settings. Disabling essential storage may affect the functionality of certain features (such as staying signed in, cart persistence, and wishlist)."
        },
        {
          "id": "6",
          "title": "6. Data Sharing and Disclosure",
          "content": "We do not sell your personal information to third parties. We may share your information only in the following circumstances:\n• With service providers who help us operate our business (payment processing, shipping, email delivery, hosting)\n• To comply with legal obligations or respond to lawful requests\n• To protect our rights, privacy, safety, or property\n• In connection with a business transfer (merger, acquisition, or sale of assets)"
        },
        {
          "id": "7",
          "title": "7. Data Security",
          "content": "We implement reasonable security measures to protect your personal information from unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
        },
        {
          "id": "8",
          "title": "8. Data Retention",
          "content": "We retain your personal information for as long as necessary to fulfil the purposes described in this policy, or as required by applicable law. When no longer needed, your data will be securely deleted or anonymised."
        },
        {
          "id": "9",
          "title": "9. Your Rights",
          "content": "You have the following rights regarding your personal information:\n• Access: Request a copy of the personal information we hold about you\n• Correction: Request correction of inaccurate or incomplete information (you can update your name and phone in your account profile)\n• Deletion: Request deletion of your account and personal information by contacting us\n• Email Change: Request a change to the email address associated with your account by contacting us\n• Opt-Out: Unsubscribe from marketing communications at any time using the unsubscribe link in emails\n\nTo exercise any of these rights, contact us at houseofpadmavati@gmail.com."
        },
        {
          "id": "10",
          "title": "10. Children''s Privacy",
          "content": "Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete it."
        },
        {
          "id": "11",
          "title": "11. Changes to This Policy",
          "content": "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated \"Last updated\" date. We encourage you to review this policy periodically."
        },
        {
          "id": "12",
          "title": "12. Contact Us",
          "content": "If you have any questions about this Privacy Policy, please contact us:\nEmail: houseofpadmavati@gmail.com\nBusiness: House of Padmavati, Bangalore, India"
        }
      ]
    }'::jsonb,
    '{
      "title": "Privacy",
      "last_updated": "October 2026",
      "meta_description": "Privacy policy for House of Padmavati — how we collect, use, and protect your personal information.",
      "contact_email": "houseofpadmavati@gmail.com",
      "contact_business": "House of Padmavati, Bangalore, India",
      "sections": [
        {
          "id": "1",
          "title": "1. Introduction",
          "content": "House of Padmavati respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website or make a purchase.\n\nBy using our website, you agree to the collection and use of information as described in this policy."
        },
        {
          "id": "2",
          "title": "2. Information We Collect",
          "content": "2.1 Personal Information You Provide\nWhen you place an order or create an account, we may collect:\n• Full name\n• Email address\n• Phone number\n• Shipping address\n• Order details\n\n2.2 Information Collected Automatically\nWhen you visit our website, we automatically collect only the following essential data:\n• Authentication tokens (stored in your browser via Supabase) to maintain your session\n• Cart and wishlist contents (stored locally in your browser)\n\nWe do not use Google Analytics, Microsoft Clarity, Meta Pixel, or any other third-party analytics or tracking services. We do not collect device information, IP addresses, or browsing behaviour for analytics purposes."
        },
        {
          "id": "3",
          "title": "3. How We Use Your Information",
          "content": "We use the collected information for the following purposes:\n• Processing and fulfilling orders\n• Communicating with you about your order\n• Providing customer support\n• Sending order updates and shipping confirmations\n• Improving our website and services\n• Complying with legal obligations\n• Preventing fraud and ensuring security"
        },
        {
          "id": "4",
          "title": "4. Third-Party Services We Use",
          "content": "We rely on the following third-party services to operate our website:\n• Supabase – hosting, database, and authentication\n• Razorpay – payment processing\n• Resend – email delivery\n• Cloudflare Pages – website hosting and deployment\n• Google Fonts – typography (fonts loaded from fonts.googleapis.com and fonts.gstatic.com)\n\nThese third-party services have their own privacy policies governing the use of your data. We encourage you to review their policies."
        },
        {
          "id": "5",
          "title": "5. Cookies and Local Storage",
          "content": "Our website uses only essential cookies and local storage:\n• Authentication tokens (via Supabase) — stored in localStorage to keep you signed in\n• Cart contents — stored in localStorage to persist your bag across sessions\n• Wishlist contents — stored in localStorage to persist your saved items\n\nWe do not use tracking cookies, advertising cookies, or analytics cookies. You can control or clear local storage and cookies through your browser settings. Disabling essential storage may affect the functionality of certain features (such as staying signed in, cart persistence, and wishlist)."
        },
        {
          "id": "6",
          "title": "6. Data Sharing and Disclosure",
          "content": "We do not sell your personal information to third parties. We may share your information only in the following circumstances:\n• With service providers who help us operate our business (payment processing, shipping, email delivery, hosting)\n• To comply with legal obligations or respond to lawful requests\n• To protect our rights, privacy, safety, or property\n• In connection with a business transfer (merger, acquisition, or sale of assets)"
        },
        {
          "id": "7",
          "title": "7. Data Security",
          "content": "We implement reasonable security measures to protect your personal information from unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
        },
        {
          "id": "8",
          "title": "8. Data Retention",
          "content": "We retain your personal information for as long as necessary to fulfil the purposes described in this policy, or as required by applicable law. When no longer needed, your data will be securely deleted or anonymised."
        },
        {
          "id": "9",
          "title": "9. Your Rights",
          "content": "You have the following rights regarding your personal information:\n• Access: Request a copy of the personal information we hold about you\n• Correction: Request correction of inaccurate or incomplete information (you can update your name and phone in your account profile)\n• Deletion: Request deletion of your account and personal information by contacting us\n• Email Change: Request a change to the email address associated with your account by contacting us\n• Opt-Out: Unsubscribe from marketing communications at any time using the unsubscribe link in emails\n\nTo exercise any of these rights, contact us at houseofpadmavati@gmail.com."
        },
        {
          "id": "10",
          "title": "10. Children''s Privacy",
          "content": "Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete it."
        },
        {
          "id": "11",
          "title": "11. Changes to This Policy",
          "content": "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated \"Last updated\" date. We encourage you to review this policy periodically."
        },
        {
          "id": "12",
          "title": "12. Contact Us",
          "content": "If you have any questions about this Privacy Policy, please contact us:\nEmail: houseofpadmavati@gmail.com\nBusiness: House of Padmavati, Bangalore, India"
        }
      ]
    }'::jsonb,
    'published',
    false
  ),
  (
    'policy.terms',
    'policy',
    'policy_document',
    'Terms & Conditions',
    1,
    '{
      "title": "Terms",
      "last_updated": "October 2026",
      "meta_description": "Terms and conditions for using House of Padmavati and purchasing our products.",
      "contact_email": "houseofpadmavati@gmail.com",
      "contact_business": "House of Padmavati, Bangalore, India",
      "sections": [
        {
          "id": "1",
          "title": "1. Introduction",
          "content": "These Terms & Conditions govern your use of the House of Padmavati website and your purchase of products from House of Padmavati. By accessing this website or placing an order, you agree to be bound by these terms.\n\nHouse of Padmavati is a sole proprietorship based in Bangalore, India."
        },
        {
          "id": "2",
          "title": "2. Business Information",
          "content": "Business Name: House of Padmavati\nBusiness Type: Sole Proprietorship\nCountry: India\nCity: Bangalore\nEmail: houseofpadmavati@gmail.com\nGST: Not Registered"
        },
        {
          "id": "3",
          "title": "3. Definitions",
          "content": "• \"House of Padmavati,\" \"we,\" \"us,\" \"our\" refers to the business named House of Padmavati.\n• \"Website\" refers to the online store and all its pages.\n• \"Products\" refers to handwoven sarees, designer sarees, and machine-assisted sarees listed for sale.\n• \"Customer,\" \"you,\" \"your\" refers to any person who visits the website or purchases products from us.\n• \"Order\" refers to a request to purchase products placed through the website."
        },
        {
          "id": "4",
          "title": "4. Eligibility",
          "content": "By placing an order, you confirm that:\n• You are at least 18 years of age.\n• You are legally capable of entering into binding contracts.\n• You have provided accurate and complete information."
        },
        {
          "id": "5",
          "title": "5. Products",
          "content": "House of Padmavati sells sarees. Each product is described to the best of our ability. We make every effort to accurately represent colours, weaves, and materials. However, colours may vary slightly depending on your screen settings and ambient lighting. Handwoven products may have minor variations that are natural characteristics of handmade goods and are not considered defects."
        },
        {
          "id": "6",
          "title": "6. Orders",
          "content": "6.1 Placing an Order\nYou may place an order through the website. Once submitted, you will receive an order confirmation email.\n\n6.2 Order Acceptance\nWe reserve the right to accept or decline any order for any reason, including but not limited to stock unavailability, pricing errors, or payment verification issues.\n\n6.3 Order Cancellation\nYou may cancel an order within 1 hour of placing it at no charge. No cancellation fee applies. Orders cannot be cancelled after 1 hour or after dispatch. To request cancellation, contact us at houseofpadmavati@gmail.com with your order number.\n\n6.4 Pricing\nAll prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices at any time without prior notice. Prices at the time of order placement will apply to that order."
        },
        {
          "id": "7",
          "title": "7. Payments",
          "content": "We accept the following payment methods:\n• UPI\n• Credit Cards\n• Debit Cards\n• Net Banking\n• Wallets\n• Razorpay\n\nCash on Delivery is not available. Payment is processed at the time of order placement. If payment is not successfully processed, the order will not be fulfilled."
        },
        {
          "id": "8",
          "title": "8. Shipping",
          "content": "Shipping and delivery terms are outlined in our Shipping Policy (/shipping-policy), which is incorporated by reference into these terms."
        },
        {
          "id": "9",
          "title": "9. Returns and Refunds",
          "content": "Return and refund terms are outlined in our Returns & Refund Policy (/returns-policy), which is incorporated by reference into these terms."
        },
        {
          "id": "10",
          "title": "10. Account Responsibility",
          "content": "If you create an account on our website, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account."
        },
        {
          "id": "11",
          "title": "11. Intellectual Property",
          "content": "All intellectual property on this website is owned by House of Padmavati, including but not limited to:\n• Logo and brand identity\n• Website design and layout\n• Editorial content and journal articles\n• Photography and videos\n• Graphics and design assets\n• Product descriptions and images\n\nYou may not reproduce, distribute, modify, or use any of our intellectual property without prior written permission."
        },
        {
          "id": "12",
          "title": "12. Privacy",
          "content": "Our Privacy Policy (/privacy-policy) governs how we collect, use, and protect your personal information. By using this website, you agree to the practices described in the Privacy Policy."
        },
        {
          "id": "13",
          "title": "13. Third-Party Services",
          "content": "We use third-party service providers for the following functions:\n• Payment Processing: Razorpay\n• Hosting and Database: Supabase\n• Email Services: Resend\n• Deployment: Cloudflare Pages\n• Typography: Google Fonts\n\nThese third parties have their own privacy policies and terms of service. We are not responsible for their practices."
        },
        {
          "id": "14",
          "title": "14. Limitation of Liability",
          "content": "To the maximum extent permitted by applicable law, House of Padmavati shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the website or purchase of products. Our total liability for any claim arising from your purchase shall not exceed the amount paid by you for the product in question."
        },
        {
          "id": "15",
          "title": "15. Force Majeure",
          "content": "We shall not be liable for any delay or failure in performance caused by events beyond our reasonable control, including but not limited to acts of God, natural disasters, pandemics, government actions, strikes, labour disruptions, transportation interruptions, or supplier failures."
        },
        {
          "id": "16",
          "title": "16. Governing Law and Jurisdiction",
          "content": "These Terms & Conditions are governed by the laws of India. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka."
        },
        {
          "id": "17",
          "title": "17. Changes to Terms",
          "content": "We reserve the right to update these Terms & Conditions at any time. Changes will be posted on this page with an updated \"Last updated\" date. Continued use of the website after changes constitutes acceptance of the revised terms."
        },
        {
          "id": "18",
          "title": "18. Contact Information",
          "content": "For questions regarding these Terms & Conditions, please contact us:\nEmail: houseofpadmavati@gmail.com\nBusiness: House of Padmavati, Bangalore, India"
        }
      ]
    }'::jsonb,
    '{
      "title": "Terms",
      "last_updated": "October 2026",
      "meta_description": "Terms and conditions for using House of Padmavati and purchasing our products.",
      "contact_email": "houseofpadmavati@gmail.com",
      "contact_business": "House of Padmavati, Bangalore, India",
      "sections": [
        {
          "id": "1",
          "title": "1. Introduction",
          "content": "These Terms & Conditions govern your use of the House of Padmavati website and your purchase of products from House of Padmavati. By accessing this website or placing an order, you agree to be bound by these terms.\n\nHouse of Padmavati is a sole proprietorship based in Bangalore, India."
        },
        {
          "id": "2",
          "title": "2. Business Information",
          "content": "Business Name: House of Padmavati\nBusiness Type: Sole Proprietorship\nCountry: India\nCity: Bangalore\nEmail: houseofpadmavati@gmail.com\nGST: Not Registered"
        },
        {
          "id": "3",
          "title": "3. Definitions",
          "content": "• \"House of Padmavati,\" \"we,\" \"us,\" \"our\" refers to the business named House of Padmavati.\n• \"Website\" refers to the online store and all its pages.\n• \"Products\" refers to handwoven sarees, designer sarees, and machine-assisted sarees listed for sale.\n• \"Customer,\" \"you,\" \"your\" refers to any person who visits the website or purchases products from us.\n• \"Order\" refers to a request to purchase products placed through the website."
        },
        {
          "id": "4",
          "title": "4. Eligibility",
          "content": "By placing an order, you confirm that:\n• You are at least 18 years of age.\n• You are legally capable of entering into binding contracts.\n• You have provided accurate and complete information."
        },
        {
          "id": "5",
          "title": "5. Products",
          "content": "House of Padmavati sells sarees. Each product is described to the best of our ability. We make every effort to accurately represent colours, weaves, and materials. However, colours may vary slightly depending on your screen settings and ambient lighting. Handwoven products may have minor variations that are natural characteristics of handmade goods and are not considered defects."
        },
        {
          "id": "6",
          "title": "6. Orders",
          "content": "6.1 Placing an Order\nYou may place an order through the website. Once submitted, you will receive an order confirmation email.\n\n6.2 Order Acceptance\nWe reserve the right to accept or decline any order for any reason, including but not limited to stock unavailability, pricing errors, or payment verification issues.\n\n6.3 Order Cancellation\nYou may cancel an order within 1 hour of placing it at no charge. No cancellation fee applies. Orders cannot be cancelled after 1 hour or after dispatch. To request cancellation, contact us at houseofpadmavati@gmail.com with your order number.\n\n6.4 Pricing\nAll prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices at any time without prior notice. Prices at the time of order placement will apply to that order."
        },
        {
          "id": "7",
          "title": "7. Payments",
          "content": "We accept the following payment methods:\n• UPI\n• Credit Cards\n• Debit Cards\n• Net Banking\n• Wallets\n• Razorpay\n\nCash on Delivery is not available. Payment is processed at the time of order placement. If payment is not successfully processed, the order will not be fulfilled."
        },
        {
          "id": "8",
          "title": "8. Shipping",
          "content": "Shipping and delivery terms are outlined in our Shipping Policy (/shipping-policy), which is incorporated by reference into these terms."
        },
        {
          "id": "9",
          "title": "9. Returns and Refunds",
          "content": "Return and refund terms are outlined in our Returns & Refund Policy (/returns-policy), which is incorporated by reference into these terms."
        },
        {
          "id": "10",
          "title": "10. Account Responsibility",
          "content": "If you create an account on our website, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account."
        },
        {
          "id": "11",
          "title": "11. Intellectual Property",
          "content": "All intellectual property on this website is owned by House of Padmavati, including but not limited to:\n• Logo and brand identity\n• Website design and layout\n• Editorial content and journal articles\n• Photography and videos\n• Graphics and design assets\n• Product descriptions and images\n\nYou may not reproduce, distribute, modify, or use any of our intellectual property without prior written permission."
        },
        {
          "id": "12",
          "title": "12. Privacy",
          "content": "Our Privacy Policy (/privacy-policy) governs how we collect, use, and protect your personal information. By using this website, you agree to the practices described in the Privacy Policy."
        },
        {
          "id": "13",
          "title": "13. Third-Party Services",
          "content": "We use third-party service providers for the following functions:\n• Payment Processing: Razorpay\n• Hosting and Database: Supabase\n• Email Services: Resend\n• Deployment: Cloudflare Pages\n• Typography: Google Fonts\n\nThese third parties have their own privacy policies and terms of service. We are not responsible for their practices."
        },
        {
          "id": "14",
          "title": "14. Limitation of Liability",
          "content": "To the maximum extent permitted by applicable law, House of Padmavati shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the website or purchase of products. Our total liability for any claim arising from your purchase shall not exceed the amount paid by you for the product in question."
        },
        {
          "id": "15",
          "title": "15. Force Majeure",
          "content": "We shall not be liable for any delay or failure in performance caused by events beyond our reasonable control, including but not limited to acts of God, natural disasters, pandemics, government actions, strikes, labour disruptions, transportation interruptions, or supplier failures."
        },
        {
          "id": "16",
          "title": "16. Governing Law and Jurisdiction",
          "content": "These Terms & Conditions are governed by the laws of India. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka."
        },
        {
          "id": "17",
          "title": "17. Changes to Terms",
          "content": "We reserve the right to update these Terms & Conditions at any time. Changes will be posted on this page with an updated \"Last updated\" date. Continued use of the website after changes constitutes acceptance of the revised terms."
        },
        {
          "id": "18",
          "title": "18. Contact Information",
          "content": "For questions regarding these Terms & Conditions, please contact us:\nEmail: houseofpadmavati@gmail.com\nBusiness: House of Padmavati, Bangalore, India"
        }
      ]
    }'::jsonb,
    'published',
    false
  )
ON CONFLICT (key) DO NOTHING;

-- Seed initial revision #1 into site_section_revisions for each seeded section
INSERT INTO public.site_section_revisions (
  section_key,
  revision_number,
  payload,
  change_summary
)
SELECT
  key,
  1,
  published_payload,
  'Initial Stage 4 baseline publication seeded from verified storefront copy'
FROM public.site_sections
WHERE key IN ('about.story', 'care.info', 'policy.shipping', 'policy.returns', 'policy.privacy', 'policy.terms')
ON CONFLICT (section_key, revision_number) DO NOTHING;
