CREATE TABLE itemOrders_copy( 
    orderId INTEGER, 
    itemId INTEGER,
    quantity INTEGER,
    PRIMARY KEY (orderId, itemId)
);
DROP TABLE itemOrders;
ALTER TABLE itemOrders_copy RENAME TO itemOrders;