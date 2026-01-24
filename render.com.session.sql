CREATE TYPE public.account_types AS ENUM
    ('Employee', 'Admin', 'Client');

ALTER TYPE public.account_types
    OWNER TO cse340_database_17iq_user;

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GMC' AND inv_model = 'Hummer';

SELECT inv_make, inv_model FROM public.inventory AS inv
INNER JOIN classification  AS 
clas ON inv.classification_id = clas.classification_id
WHERE clas.classification_name = 'Sport';

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, ' /images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, ' /images', '/images/vehicles')

