from bottle import Bottle, request, redirect, static_file, redirect, response, template
import mysql.connector #import mysql database connector
app = Bottle()
import json
import hashlib
import datetime as DT
import calDistance
db_username="root"
db_password=""
db_host="127.0.0.1"
db_database="p!ck0"
#Path
@app.error(404)
def error404(error):
    return static_file("./404notfound.html", root="")
@app.route("/")
def setH():
    #check if user has login before, if yes redirect into their home html
    if request.get_cookie("account", secret='oifpgjpios') != None:
        if request.get_cookie("account", secret='oifpgjpios')[1] == 'customer':
            redirect("./home")
        elif request.get_cookie("account", secret='oifpgjpios')[1] == 'driver':
            redirect("./driverHome")
        elif request.get_cookie("account", secret='oifpgjpios')[1] == 'owners':
            redirect("./ownerHome")
    else:
        redirect("./index.html#Login-Client")
#set up the html css js path
@app.route("/index.html")
def setHTML():
    request.url
    return static_file("./index.html", root="")


@app.route('/css/<filepath:path>')#set up CSS
def server_static_css(filepath):
    return static_file(filepath, root='./css')

@app.route('/js/<filepath:path>')#set up CSS
def server_static_js(filepath):
    return static_file(filepath, root='./js')
@app.route('/img/<filepath:path>')#set up images
def server_static_images(filepath):
    return static_file(filepath, root='./img')

#set path to restaurants
@app.route('/restaurants/<filepath:path>')#set up restaurants
def server_static_restaurants(filepath):
    return static_file(filepath, root='./restaurants')
@app.route('/restaurants/img/<filepath:path>')#set up restaurants
def server_static_restaurants(filepath):
    return static_file(filepath, root='./restaurants')
@app.route("/orderstatus")
def setorderstatus():
    return static_file("./orderstatus.html", root="")
@app.route("/setting")
def orderowner():
    request.url
    return static_file("./storeSetting.html", root="")
@app.route("/home") # added home.html in path home
def homePage():
    return static_file("./home.html", root="")
@app.route("/ownerHome")
def setownerHome():
    return static_file("./ownerHome.html", root="")
@app.route("/driverHome")
def driverHome():
    return static_file("./driverHome.html", root="")
@app.route("/orderowner")
def orderowner():
    request.url
    return static_file("./ownerOrders.html", root="")
@app.route("/driverOrder")
def orderdriver():
    request.url
    return static_file("./driverOrders.html", root="")
@app.route("/cart") # added cart.html in path home
def cartPage():
    return static_file("./cart.html", root="")
@app.route("/orderhistory") # added cart.html in path home
def orderhistory():
    return static_file("./orders.html", root="")
@app.route("/profile")# added profile.html in path profile
def profilePage():
    return static_file("./profile.html", root="")
@app.route("/404")# added 404 when not verified user enter user site it will redirect them into this page.
def pageof404():
    return static_file("./404.html", root="")
@app.route('/login', method='POST') #post request, it will check if user enter correct password or email
def do_login():
    body=request.json # front end will send username and password in json
    #print(body)
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    username=body["username"]
    password=hashlib.sha256(body['password'].encode()).hexdigest() #hash the password
    exists = "SELECT * FROM " + body['role'] +" WHERE username = %s AND Password = %s"#check if username and password is the same
    entry = (username,password) 
    mycursor.execute(exists,entry)
    result = mycursor.fetchone()
    if result != None: #if yes then set cookie where idx 0 is username and idx 1 is their role and return true. True means that user has enter the correct password
        response.set_cookie("account", [username,body['role']], secret='oifpgjpios', expires = DT.date.today() + DT.timedelta(days=7))#set 7day cookies
        sql.close()
        return 'true'
    else: # if enter wrong email or password return false
        sql.close()
        return 'false'

#Get Cookie
@app.route('/hello') #use for testing if cookie if correct or not
def hello():
    username = request.get_cookie("account", secret='oifpgjpios')
    #print(username)
    return template('Hello {{name}}', name=username)

#handle register
@app.route('/register',method="POST") #when user register
def register():
    body = request.json #front end will pass all the information.
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM " + body['role'] +" WHERE username = %s OR Phone = %s" #check if username or phone number has been registered before
    entry = (body["username"],body["phone"])
    mycursor.execute(exists,entry)
    result = mycursor.fetchone()
    if result != None: #if has registered before tell frontend it has been register
        sql.close()
        return 'false'
    else:#if no been register yet
        if body['role']=='customer': #if user are registering as customer
            insert = "INSERT INTO customer (username,password,first,last,address,phone) VALUES (%s, %s,%s,%s,%s,%s)"
            entry= (body['username'],hashlib.sha256(body['password'].encode()).hexdigest(),body['first'],body['last'],body['add'],body['phone']) #set entry
        elif body['role']=='driver': #if user are registering as driver 
            insert = "INSERT INTO driver (username,password,first,last,address,phone,license,latlong,status) VALUES (%s, %s,%s,%s,%s,%s,%s,%s,%s)"
            entry= (body['username'],hashlib.sha256(body['password'].encode()).hexdigest(),body['first'],body['last'],body['add'],body['phone'],body['license'],'0,0','false')#set entry 
        elif body['role']=='owners':#if user are registering as owner
            insert = "INSERT INTO owners (username,password,first,last,address,phone) VALUES (%s, %s,%s,%s,%s,%s)"
            entry= (body['username'],hashlib.sha256(body['password'].encode()).hexdigest(),body['first'],body['last'],body['add'],body['phone']) # set  entry
        mycursor.execute(insert,entry) #insert into DB
        sql.commit()
        sql.close()
        return 'true' #this will tell front end that user information has been insert into db successfully

@app.route('/userProfile',method='POST') #get user profile that they register and send it back into profile.js
def getUserProfile():
    body = request.json#front end will pass their role.
    if request.get_cookie("account", secret='oifpgjpios') == None:
        return "false"
    username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM " + body['role'] +" WHERE username = %s" #go to db table to search for user
    entry=(username,)
    mycursor.execute(exists,entry)
    result = mycursor.fetchone()
    add=result[5].split(', ')
    dict={
        "username":result[1],
        "first":result[3],
        "last":result[4],
        "address":add[0],
        "city":add[1],
        "state":add[2],
        "zip":add[3],
        "phone":result[6]
    }
    sql.close()
    return (dict) #send all the information back to front end

@app.route('/updateProfile',method='POST') #if user wants to update their profile
def updateProfile():
    body=request.json #front send information that user wants to update
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)    
    exists = "SELECT * FROM " + body['role'] +" WHERE username = %s"
    entry=(username,)
    mycursor.execute(exists,entry)
    result = mycursor.fetchone()
    if(body["email"]==result[1] and body["phone"]==result[6]):#if didnt change their email or phone
        update = "UPDATE " + body['role'] +" SET first = %s, last = %s, address=%s WHERE username=%s" #update all expect email/phone
        entry=(body['first'],body['last'],body['add'],username)
        mycursor.execute(update,entry)
        sql.commit()
        return 'true'
    elif(body["email"]==result[1] and body["phone"]!=result[6]): #if didnt change email
        exists = "SELECT * FROM " + body['role'] +" WHERE Phone = %s" #search if phone exists
        entry=(str(body["phone"]),)
        mycursor.execute(exists,entry)
        result = mycursor.fetchone()
        if result != None: #if exists return flase
            sql.close()
            return 'false Phone'
        else:#else update all expect email
            update = "UPDATE " + body['role'] +" SET first = %s, last = %s, address=%s, phone=%s WHERE username=%s" 
            entry=(body['first'],body['last'],body['add'],body["phone"],username)
            mycursor.execute(update,entry)
            sql.commit()
            sql.close()
            return 'true'
    elif(body["email"]!=result[1] and body["phone"]==result[6]): #if user didnt change phone
        exists = "SELECT * FROM " + body['role'] +" WHERE username = %s" #search if email exists
        entry=(str(body["email"]),)
        mycursor.execute(exists,entry)
        result = mycursor.fetchone()
        if result != None: #if exists return false
            sql.close()
            return 'false Email'
        else:#update all expect phone
            update = "UPDATE " + body['role'] +" SET first = %s, last = %s, address=%s, username=%s WHERE username=%s"
            entry=(body['first'],body['last'],body['add'],body["email"],username)
            mycursor.execute(update,entry)
            sql.commit()
            response.set_cookie("account", [body['email'],body['role']], secret='oifpgjpios', expires = DT.date.today() + DT.timedelta(days=7))
            sql.close()
            return 'true'
    else: #if user wants to update all the information
        exists = "SELECT * FROM " + body['role'] +" WHERE username = %s OR Phone = %s" #check if email or phone exists
        entry = (body["email"],body["phone"])
        mycursor.execute(exists,entry)
        result = mycursor.fetchone()
        if result != None: #if one of them exists return false
            sql.close()
            return 'false'
        else:#update all
            update = "UPDATE " + body['role'] +" SET first = %s, last = %s, address=%s, username=%s, phone=%s WHERE username=%s"
            entry=(body['first'],body['last'],body['add'],body["email"],body['phone'],username)
            mycursor.execute(update,entry)
            sql.commit()
            response.set_cookie("account", [body['email'],body['role']], secret='oifpgjpios', expires = DT.date.today() + DT.timedelta(days=7))
            sql.close()
            return 'true'

@app.route('/updatePassword',method='POST') #if user wants to update their password
def updatePassword():
    body=request.json #front will pass role, old password, and new password
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    password=hashlib.sha256(body['oldpw'].encode()).hexdigest()
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM " + body['role'] +" WHERE username = %s AND Password = %s" #check if old password are correct
    entry = (username,password)
    mycursor.execute(exists,entry)
    result = mycursor.fetchone()
    if result != None: #if correct
        update = "UPDATE " + body['role'] +" SET password=%s WHERE username=%s"
        updatePW=hashlib.sha256(body['password'].encode()).hexdigest() #hash the new password
        entry=(updatePW,username)
        mycursor.execute(update,entry)#update
        sql.commit()
        sql.close()
        return 'true'
    else:#if not correct return false
        sql.close()
        return 'false'
@app.route('/updateStore',method='POST') #if user wants to update their password
def updateStore():
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    body=request.json #front will pass role, old password, and new password
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM restaurants WHERE owner = %s" #check if old password are correct
    entry = (str(username),)
    mycursor.execute(exists,entry)
    result = mycursor.fetchone()
    if result != None: #if correct
        update = "UPDATE restaurants SET name=%s,description=%s,type=%s,address=%s,time=%s,image=%s  WHERE owner=%s"
        entry=(body['name'],body['desc'],body['type'],body['add'],body['time'],body['img'],body['owner'])
        mycursor.execute(update,entry)#update
        sql.commit()
        sql.close()
        return 'true'
    else:#if not correct return false
        sql.close()
        return 'false'
@app.route('/getFirst',method='POST') #get first name it will use in home page. Like Welcome back firstname and get the cart
def FirstName():
    body=request.json
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM " + body['role'] +" WHERE username = %s"
    entry=(str(username),)
    mycursor.execute(exists,entry)
    result = mycursor.fetchone()
    exists = "SELECT * FROM cart WHERE username = %s"
    entry=(str(username),)
    mycursor.execute(exists,entry)
    resultCart = mycursor.fetchall()
    count=0
    for i in resultCart:
        count+=i[4]
    if(result != None):
        sql.close()
        return json.dumps([result[3],count]) #send firstname back to front
    else:
        sql.close()
        return json.dumps(["False",0])

@app.route('/logout',method='POST') #if the user wants to log out
def logout():
    username = request.get_cookie("account", secret='oifpgjpios')[0]
    response.set_cookie("account", username, secret='oifpgjpios', max_age=0) #delete the cookie
    return "true"

@app.route('/getRestaurant',method='GET') #get restaurant from db
def getRestaurant():
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM customer WHERE username =%s" #search for customer table and get the current user's zipcode
    entry=(str(username),)
    mycursor.execute(exists,entry)
    result=mycursor.fetchone()
    userZip=result[5].split(", ")[-1]#get the zipcode
    mycursor.execute("SELECT * FROM restaurants") #get all the restaurants
    result = mycursor.fetchall()
    res=calDistance.filterLocation(userZip,result)#filter out the resturant where resutrant zipcode is greater 15 mile of current user zipcode
    sql.close()
    return json.dumps(res) #send data back to front

@app.route('/getMenu',method='POST') #get restaurant menu from db
def getMenu():
    body=request.json
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM menus WHERE owner = %s" #search for customer table and get the current user's zipcode
    entry=(str(body['store']),)
    mycursor.execute(exists,entry)
    result = mycursor.fetchall()
    #print(result)
    dict={}
    for i in result:
        if i[7] != 'oos':#if meal is not oos
            if i[6] not in dict:
              dict[i[6]]=[]
            dict[i[6]].append(i)
    sql.close()
    return json.dumps(dict) #send data back to front
@app.route('/addtocart',method='POST') #when user click atc
def addtocart():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM cart WHERE username =%s AND owner=%s AND productTitle=%s"
    entry=(username,body['owner'],body['productTitle'])
    #print(exists,entry)
    mycursor.execute(exists,entry)
    result=mycursor.fetchone()
    if result != None: #if adding same item into cart just add the increase the count to 1
        count=int(result[4])+1
        #print(count)
        update="UPDATE cart SET count =%s WHERE username =%s AND owner=%s AND productTitle=%s AND type=%s"
        entry=(count,username,body['owner'],body['productTitle'],body['type'])
        mycursor.execute(update,entry)
        sql.commit()
        sql.close()
        return 'true'
    else:
        exists = "SELECT * FROM cart WHERE username = %s"
        entry=(str(username),)
        mycursor.execute(exists,entry)
        result = mycursor.fetchone()
        if result== None: #if user just order
            insert = "INSERT INTO cart (username,owner,price,count,productTitle,type) VALUES (%s,%s,%s,%s,%s,%s)"
            entry=(username,str(body['owner']),body['price'],body['count'],body['productTitle'],body['type'])
            #print(insert,entry)
            mycursor.execute(insert,entry) #insert into DB
            sql.commit()
            sql.close()
            return 'true'
        if str(result[2]) != str(body['owner']):#check if user are ordering in same store if not tell user
            return str(result[2])
        else:#if user ordering at same store insert it
            insert = "INSERT INTO cart (username,owner,price,count,productTitle,type) VALUES (%s,%s,%s,%s,%s,%s)"
            entry=(username,str(body['owner']),body['price'],body['count'],body['productTitle'],body['type'])
            #print(insert,entry)
            mycursor.execute(insert,entry) #insert into DB
            sql.commit()
            sql.close()
            return 'true'

@app.route('/deleteCart',method='POST') #when user start new order
def deleteCart():
    username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    delete = "DELETE FROM cart WHERE username =%s"
    entry=(str(username),)
    mycursor.execute(delete,entry)
    sql.commit()
    sql.close()
    return 'true'
@app.route('/getCart',method='GET') #When user at cart page
def getCart():
    username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    cart = "SELECT * FROM cart WHERE username =%s"
    entry=(str(username),)
    mycursor.execute(cart,entry)
    result=mycursor.fetchall()
    sql.close()
    return json.dumps(result)
@app.route('/del-from-cart',method='POST') #When user at cart page
def delFromCart():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    delete = "DELETE FROM cart WHERE username =%s AND owner=%s AND productTitle=%s AND type=%s"
    entry=(username,body['owner'],body['productTitle'],body['type'])
    mycursor.execute(delete,entry)
    sql.commit()
    sql.close()
    return 'true'

@app.route('/getOwnerMenu',method='POST') #get restaurant from db
def getOwnerMenu():
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM restaurants WHERE owner =%s" #search for owner
    entry=(str(username),)
    mycursor.execute(exists,entry)
    result=mycursor.fetchone()
    rn=result[1] # get restaurants name.
    exists = "SELECT * FROM menus WHERE Owner =%s" #search for menu table and get the owner menu
    entry=(str(rn),)
    mycursor.execute(exists,entry)
    result=mycursor.fetchall()
    sql.close()
    return json.dumps(result) #send data back to front
@app.route('/edit_meal',method='POST') #get restaurant from db
def edit_meal():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM restaurants WHERE owner =%s" #search for owner
    entry=(str(username),)
    mycursor.execute(exists,entry)
    result=mycursor.fetchone()
    rn=result[1] # get restaurants name.
    update = "UPDATE menus SET name = %s, price=%s, description=%s, image=%s, type=%s, status=%s WHERE owner=%s AND name=%s AND type=%s AND description=%s "
    entry=(body['editname'],float(body['editprice']),body['editdesc'],body['editimg'],body['edittype'],body['editstatus'],body['owner'],body['name'],body['type'],body['desc'])
    #print(update)
    #print(entry)
    mycursor.execute(update,entry)
    sql.commit()
    sql.close()
    return 'true'
@app.route('/add_meal',method='POST') #get restaurant from db
def add_meal():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM restaurants WHERE owner =%s" #search for owner
    entry=(str(username),)
    mycursor.execute(exists,entry)
    result=mycursor.fetchone()
    rn=result[1] # get restaurants name.
    insert = "INSERT INTO menus (name,owner,price,description,image,type,status) VALUES (%s, %s,%s,%s,%s,%s,%s)"
    entry= (body['name'],rn,body['price'],body['desc'],body['img'],body['type'],body['status']) # set  entry
    mycursor.execute(insert,entry) #insert into DB
    sql.commit()
    sql.close()
    return 'true'
@app.route('/remove_meal',method='POST') #get restaurant from db
def remove_meal():
    body=request.json
    #print(body)
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    delete = "DELETE FROM menus WHERE owner=%s AND name=%s AND type=%s AND price=%s"
    entry= (body['owner'],body['name'],body['type'],float(body['price'])) # set  entry
    mycursor.execute(delete,entry) #delete from DB
    sql.commit()
    sql.close()
    return 'true'

@app.route('/delete_type',method='POST') #get restaurant from db
def delete_type():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM restaurants WHERE owner =%s" #search for owner
    entry=(str(username),)
    mycursor.execute(exists,entry)
    result=mycursor.fetchone()
    rn=result[1] # get restaurants name.
    delete=""
    if body['type']=='oos':
        delete = "DELETE FROM menus WHERE owner=%s AND status=%s"
    else:
        delete = "DELETE FROM menus WHERE owner=%s AND type=%s"
    entry= (rn,body['type']) # set  entry
    mycursor.execute(delete,entry) #insert into DB
    sql.commit()
    sql.close()
    return 'true'

@app.route('/placeOrder',method='POST') #get restaurant from db
def placeOrder():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]

    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM restaurants WHERE name =%s" #search for owner
    entry=(str(body['storename']),)
    mycursor.execute(exists,entry)
    result=mycursor.fetchone()
    ownerid=result[7]
    exists = "SELECT * FROM orders" #search for owner
    mycursor.execute(exists)
    result=mycursor.fetchall()
    lastrowcount=result[-1][0]+1
    orderid=int(hashlib.sha1(str(lastrowcount).encode("utf-8")).hexdigest(), 16) % (10 ** 8)
    insert="insert into orders(customerid, ownerid,driverid, orderId, orderdate, storename, subtotal, taxfee, totalitems, deliverfee,drivertips, total, status) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    entry=(username,ownerid,"NULL",orderid,body['orderdate'],body['storename'],body['subtotal'],body['taxfee'],body['totalItems'],body['deliverfee'],body['drivertips'],body['total'],"Waiting owner confirm")
    mycursor.execute(insert,entry) #insert into DB
    sql.commit()
    exists = "SELECT * FROM cart WHERE username =%s" #search for owner
    entry=(str(username),)
    mycursor.execute(exists,entry)
    products=mycursor.fetchall()
    insert="insert into orderdetails(orderid, productname, productPrice, quantity) values (%s,%s,%s,%s)" 
    for i in products:
        entry=(orderid,i[5],i[3],i[4])
        mycursor.execute(insert,entry)
        sql.commit()
    delete="delete from cart where username= %s"
    entry=(str(username),)
    mycursor.execute(delete,entry)
    sql.commit()
    sql.close()
    return json.dumps(orderid)

@app.route('/getOrderHistory',method='GET') #get restaurant from db
def getOrderHistory():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)

    exists = "SELECT * FROM orders WHERE customerid=%s"
    entry= (str(username),) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    result=mycursor.fetchall()
    listcustomer=[]
    listOwner=[]
    for i in result:
        #(6, 'zou.chenyi@yahoo.com', 'zou.chenyi@yahoo.com', 'NULL', '48555128', '03/20/2021', 'china-taste', '214.95$', '29.82$', 'Total: 6 Items', '3.99$', '3', '251.76$', 'Waiting For Driver')
        exists = "SELECT * FROM customer WHERE username=%s"
        entry= (str(i[1]),) 
        mycursor.execute(exists,entry) #delete from DB
        customerResult=mycursor.fetchone()
        exists = "SELECT * FROM restaurants WHERE name=%s"
        entry= (str(i[6]),) 
        mycursor.execute(exists,entry) #delete from DB
        storeResult=mycursor.fetchone()
        if i[3]!='NULL':
            exists = "SELECT * FROM driver WHERE username=%s"
            entry= (str(i[3]),) 
            mycursor.execute(exists,entry) #delete from DB
            driverResult=mycursor.fetchone()
            listcustomer.append([customerResult[3]+' '+customerResult[4],customerResult[5],customerResult[6],storeResult[8],driverResult[8]])
        else:
            listcustomer.append([customerResult[3]+' '+customerResult[4],customerResult[5],customerResult[6],storeResult[8]])
    sql.close()
    return json.dumps((result,listcustomer))
@app.route('/getOrderDetails',method='POST') #get restaurant from db
def getOrderDetails():
    body=request.json
    #print(body)
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)

    exists = "SELECT * FROM orderdetails WHERE orderId=%s"
    entry= (str(body['orderid']),) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    result=mycursor.fetchall()
    sql.close()
    return json.dumps(result)


# Owner
@app.route('/getOrderHistoryOwner',method='GET') #get restaurant from db
def getOrderHistory():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)

    exists = "SELECT * FROM orders WHERE ownerid=%s"
    entry= (str(username),) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    result=mycursor.fetchall()
    listcustomer=[]
    for i in result:
        #print(i[1])
        exists = "SELECT * FROM customer WHERE username=%s"
        entry= (str(i[1]),) 
        mycursor.execute(exists,entry) #delete from DB
        customerResult=mycursor.fetchone()
        listcustomer.append([customerResult[3]+' '+customerResult[4],customerResult[5],customerResult[6]])
    sql.close()
    return json.dumps((result,listcustomer))
@app.route('/getOrderHistoryDriver',method='GET') #get restaurant from db
def getOrderHistoryDriver():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)

    exists = "SELECT * FROM orders WHERE driverid=%s"
    entry= (str(username),) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    result=mycursor.fetchall()
    listcustomer=[]
    for i in result:
        #print(i)
        exists = "SELECT * FROM customer WHERE username=%s"
        entry= (str(i[1]),) 
        mycursor.execute(exists,entry) #delete from DB
        customerResult=mycursor.fetchone()
        listcustomer.append([customerResult[3]+' '+customerResult[4],customerResult[5],customerResult[6]])
    sql.close()
    return json.dumps((result,listcustomer))
@app.route('/ownerConfirmed',method='POST') #get restaurant from db
def ownerConfirmed():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "UPDATE orders SET status = 'Waiting For Driver' WHERE orderid=%s"
    entry= (str(body['orderid']),) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    sql.commit()
    sql.close()
    return "true"

@app.route('/getDriverStatus',method='GET') #get restaurant from db
def ownerConfirmed():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM driver WHERE username=%s"
    entry= (str(username),) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    result=mycursor.fetchone()
    sql.commit()
    sql.close()
    return result[9]

@app.route('/updateDriverStatus',method='POST') #get restaurant from db
def ownerConfirmed():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "UPDATE driver SET status = %s WHERE username=%s"
    entry= (str(body['status']),str(username)) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    if(body['status']=='accept'):
            update = "UPDATE orders SET status = %s, driverid=%s WHERE orderid=%s"
            entry= ("Picking Up",username,str(body['orderid'])) # set  entry
            mycursor.execute(update,entry) #delete from DB
    elif(body['status']=='picked'):
            update = "UPDATE orders SET status = %s WHERE orderid=%s"
            entry= ("On The Way",str(body['orderid'])) # set  entry
            mycursor.execute(update,entry) #delete from DB
    elif(body['status']=='delivered'):
            update = "UPDATE orders SET status = %s WHERE orderid=%s"
            entry= ("Delivered",str(body['orderid'])) # set  entry
            mycursor.execute(update,entry) #delete from DB
            exists = "UPDATE driver SET status = %s WHERE username=%s"
            entry= ("true",str(username)) # set  entry
            mycursor.execute(exists,entry) #delete from DB
    sql.commit()
    sql.close()
    return 'true'
@app.route('/updateLL',method='POST') #get restaurant from db
def updateLL():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "UPDATE customer SET latLong = %s WHERE username=%s"
    entry= (str(body['latLong']),str(username)) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    result=mycursor.fetchone()
    sql.commit()
    sql.close()
    return 'true'

@app.route('/updateDriverLocation',method='POST') #get restaurant from db
def updateDriverLocation():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "UPDATE driver SET latlong = %s WHERE username=%s"
    entry= (str(body['latLong']),str(username)) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    result=mycursor.fetchone()
    sql.commit()
    sql.close()
    return 'true'
@app.route('/getDriverTodayEarn',method='POST') #get restaurant from db
def getDriverTodayEarn():
    body=request.json
    #print(body)
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "select * from orders where orderdate like %s and driverid=%s "
    entry= ( ('%'+str(body['date'])+'%') ,str(username)) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    result=mycursor.fetchall()
    if result == None:
        return 'false'
    earn=0.00
    for i in result:
        earn += float(i[11])
    sql.close()
    return json.dumps(earn)

@app.route('/getDriverCurrentOrderDetails',method='GET') #get restaurant from db
def getDriverCurrentOrderDetails():
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "SELECT * FROM orders WHERE driverid=%s AND (status=%s OR status=%s)"
    entry= (str(username),"Picking Up","On The Way") # set  entry
    mycursor.execute(exists,entry) #delete from DB
    orders=mycursor.fetchone()
    orderid=orders[4]
    customerid=orders[1]
    ownerid=orders[2]
    storeName=orders[6].replace('-',' ')
    exists = "SELECT * FROM orderdetails WHERE orderId=%s"
    entry= (orderid,) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    orderDetails=mycursor.fetchall()
    exists = "SELECT * FROM customer WHERE username=%s"
    entry= (customerid,) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    customerDetails=mycursor.fetchone()
    exists = "SELECT * FROM restaurants WHERE owner=%s"
    entry= (ownerid,) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    ownerDetails=mycursor.fetchone()
    sql.commit()
    sql.close()
    return json.dumps([orderDetails,[customerDetails[3]+' ' +customerDetails[4],customerDetails[5],customerDetails[7]],[ownerDetails[1].replace('-',' '),ownerDetails[4],ownerDetails[8]]])

@app.route('/driverGetOrder',method='GET') #get restaurant from db
def driverGetOrder():
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "select * from orders"
    mycursor.execute(exists)
    result=mycursor.fetchall()
    dic={}
    for i in result:
        if i[13] == "Waiting For Driver":
            exists = "select * from customer where username=%s"
            entry=(str(i[1]),)
            mycursor.execute(exists,entry)
            customerLL=mycursor.fetchone()[7]
            exists = "select * from restaurants where owner=%s"
            entry=(str(i[2]),)
            mycursor.execute(exists,entry)
            storeLL=mycursor.fetchone()[8]
            exists = "select * from driver where username=%s"
            entry=(str(username),)
            mycursor.execute(exists,entry)
            driverLL=mycursor.fetchone()[8]
            dic[i[4]]={
                "storeName":i[6].replace('-',' '),
                "orderId":i[4],
                "totalItems":i[9],
                "tip":i[11],
                "storeLL":storeLL,
                "customerLL":customerLL,
                "driverLL":driverLL
            }
    sql.commit()
    sql.close()
    return json.dumps(dic)

@app.route('/getStoreDetails',method='GET') #get restaurant from db
def getStoreDetails():
    username = request.get_cookie("account", secret='oifpgjpios')
    if username == None:
        return json.dumps(["False","False"])
    else:
        username = request.get_cookie("account", secret='oifpgjpios')[0]
    sql= mysql.connector.connect(user=db_username, password=db_password,
                                host=db_host,
                                database=db_database)
    mycursor = sql.cursor(buffered=True)
    exists = "select * from restaurants where owner = %s"
    entry= (str(username),) # set  entry
    mycursor.execute(exists,entry) #delete from DB
    result=mycursor.fetchone()
    sql.close()
    return json.dumps(result)


from paste import httpserver
httpserver.serve(app, host='localhost',port=8080)   