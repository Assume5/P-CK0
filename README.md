# P!CK0
  ## Project description:
  ### 
  P!CK0 is an online food ordering/delivering web-base application, allowing customers and drivers to freely choose their orders based on possible order choices. Without very low tipped order being sent to the driver.

There will be three interfaces. Users can register themselves to three different roles, such as Customer, Driver, Store Owners. Customers will be users that order foods, Drivers will be users that deliver food to the Customers, and Store Owners will be users that provide the food for customers to order. When users login, it will redirect users to their corresponding interface.

Client’s interface. Shown available restaurants in the area, customers will be redirected to restaurant order menus (HTML) where they click and choose their orders. Then redirected to payment site (HTML). Then this order will appear in the driver's interface for drivers to pick.

When the Store Owner registers, the request will be sent to the admin. Once the admin receives the request, the admin will ask for menus and set up a html order page for the owner.
Owners interfaces. Owner will be able to confirm the order and will be able to select if their item is OOS or not.

Drivers’ interfaces. When a user registers for a driver position, the user will be sent to the administration for verification. Verification will be implemented once the app is ready to release to public. Drivers will see all available orders for delivery, They can pick any order to delivery.

The position verification for user login will be verified through database record. 

Since this app is under development we can ignore the verification step for now, once it’s ready for publication we will implement verification features for restaurant owners and drivers in the future. 
###
 ## Installation
 ### In order to compile the app, you must have bottle, mysql-connector, hashlib, datetime, and paste installed.
 ### Here is the command for install.  
 ###
    pip install bottle
    pip install mysql-connector-python
    pip install hashlib
    pip install DateTime
    pip install Paste
###
## Installation Database
### After you installed requirement that server needs, we need to setup our database.
### Lets create our database table first.
### There will be 8 tables that we need to create. cart, customer, driver, menus, orderdetails, orders, owners, restaurant.
### Put the following command in your mysql workbench and execute it.
### 
    create table cart(
    	ID int unique NOT NULL AUTO_INCREMENT,
        Username varchar(50) NOT NULL ,
        owner varchar(50) NOT NULL,
    	price varchar(50) NOT NULL,
        count Int NOT NULL,
        productTitle varchar(50) NOT NULL,
        type varchar(45)  NOT NULL
    );
    create table customer(
    	ID int unique NOT NULL AUTO_INCREMENT,
        Username varchar(50) unique NOT NULL ,
        Password varchar(300) NOT NULL,
    	First varchar(50) NOT NULL,
        Last varchar(50) NOT NULL,
        address varchar(50) NOT NULL,
        Phone varchar(10) unique NOT NULL,
    	latLong varchar(100)
    );
    create table driver(
    	ID int unique NOT NULL AUTO_INCREMENT,
        Username varchar(50) unique NOT NULL ,
        Password varchar(300) NOT NULL,
    	First varchar(50) NOT NULL,
        Last varchar(50) NOT NULL,
        address varchar(50) NOT NULL,
        Phone varchar(10) unique NOT NULL,
    	License Int unique Not Null,
		latlong varchar(100)  Not Null,
    	status varchar(45)  Not Null
    );
    create table menus (
        ID int unique NOT NULL AUTO_INCREMENT,
        name varchar(50) NOT NULL,
        Owner varchar(50) NOT NULL,
        Price float NOT NULL,
        description varchar(50) NOT NULL,
        image varchar(50),
        type varchar(50) NOT NULL,
        status varchar(50) NOT NULL
    );
    create table orderDetails (
     ID int unique NOT NULL AUTO_INCREMENT,
     orderId varchar(50),
     productname varchar(50) NOT NULL,
     productPrice varchar(50) NOT NULL,
     quantity varchar(100) NOT NULL
    );
    create table orders (
        ID int unique NOT NULL AUTO_INCREMENT,
        customerid varchar(50) Not null,
        ownerid varchar(50) Not null,
        driverid varchar(50) Not null,
        orderId varchar(100) Not null,
        orderdate varchar(50) Not null,
        storename varchar(50) Not null,
        subtotal varchar(50) Not null,
        taxfee varchar(100) Not null,
        totalitems varchar(50) Not null,
        deliverfee varchar(50) Not null,
        drivertips varchar(50) Not null,
        total varchar(100) Not null,
        status varchar(100) Not null
    );
    insert into orders(customerid, ownerid,driverid, orderId, orderdate, storename, subtotal, taxfee, totalitems, deliverfee,drivertips, total, status) values ("test","test","test","test","test","test","test","test","test","test","test","test","test");
    create table owners(
    	ID int unique NOT NULL AUTO_INCREMENT,
        Username varchar(50) unique NOT NULL ,
        Password varchar(300) NOT NULL,
    	First varchar(50) NOT NULL,
        Last varchar(50) NOT NULL,
        address varchar(50) NOT NULL,
        Phone varchar(10) unique NOT NULL
    );
    create table restaurants (
        ID int unique NOT NULL AUTO_INCREMENT,
        name varchar(50) Not NULL,
        description varchar(50) Not NULL,
        type varchar(50) Not null,
        address varchar(50) Not null,
        time varchar(50) Not null,
        image varchar(50) Not null,
        owner varchar(500) unique Not NULL,
        latlong varchar(500) Not null
    );
### 
## Now, let's insert restaurants so that they will display in the customer interface.
###
	insert into restaurants (name,description,type, address, time,image,owner,latlong) values("china-taste", "traditional chinese food", "asian", "3332 Sheridan Dr, Buffalo, NY, 14226", "12:00 PM - 08:45 PM","./img/ramen.png","owner1@gmail.com","42.98084858617561, -78.8102731799607");
	insert into restaurants (name,description,type, address, time,image,owner,latlong) values("india-taste", "traditional india food", "asian", "3332 Sheridan Dr, Buffalo, NY, 14226", "12:00 PM - 08:45 PM","./img/ramen.png","owner2@gmail.com","42.98084858617561, -78.8102731799607");
### 
## You must assign the owner's account that you had registered, or else the owner can't log in or modify/add their menus.
### calDistance.py will filter out restaurants that customer's current zipcode > 15 miles. The MySQL code above was assigned zipcode 14226, so make sure you create a customer account within that 15 miles range. Feel free to modify the code above.
### For the colum name, it represent restaurant name. Please replace " " to "-" and lowercase. For example I am assigning China Taste I need to change it to china-taste.
### The reason I do it in this way because someone might provide a fake restaurant address and name, so we need to verify if this restaurant exists and is safe for the customer. After verifying the process we insert it into the database and assign the owner and set up HTML files.


## After you installed all the requirements, you may start using the app.


###
    cd P1CK0
    server.py
### 
### This will listen on the local host 8080, so open the browser then types http://localhost:8080/. By doing that you should see a login interface. If you see the login interface then you may start using the app!

## Tutorial
### For a example use case please see the video! There will be explanation located in the caption, so make sure you have caption opened. 
    https://youtu.be/1aV7SXdvaf0
