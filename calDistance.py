from math import cos, asin, sqrt, pi
import json
from urllib.request import Request, urlopen
import csv
def filterLocation(customerZip,resturantsZip):
    customerLL=getCusLL(customerZip)
    filterList=[]
    with open('./zipcode/us-zip-code-latitude-and-longitude.csv') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=' ')
        for row in spamreader:
            if(row[0].split(';')[0]==str(customerZip)):
                customerLL=row[0].split(';')[-1].split(",")
                break
    with open('./zipcode/us-zip-code-latitude-and-longitude.csv') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=' ')
        for i in range(0,len(resturantsZip)):
            zip=resturantsZip[i][4].split(", ")[-1]
            resturantsLL=getResLL(zip)
            result=distanceInkm(float(customerLL[0]),float(customerLL[1]),float(resturantsLL[0]),float(resturantsLL[1]))
            if(result<16):
                filterList.append(resturantsZip[i])
    print(len(filterList))
    return filterList
def getCusLL(customerZip):
    with open('./zipcode/us-zip-code-latitude-and-longitude.csv') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=' ')
        for row in spamreader:
            if(row[0].split(';')[0]==str(customerZip)):
                return row[0].split(';')[-1].split(",")
def getResLL(zip):
    with open('./zipcode/us-zip-code-latitude-and-longitude.csv') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=' ')
        for row in spamreader:
                if(row[0].split(';')[0]==str(zip)):
                    return row[0].split(';')[-1].split(",")

                    #TOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO SOLLLLLLLLLLLLLLLLLLLLLLW
# def filterLocation123(customerZip,resturantsZip):
#     url="https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q="+customerZip.replace(" ","")
#     req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
#     webpage=urlopen(req).read()
#     customerLocation=json.loads(webpage)
#     customerLL=customerLocation["records"][0]["fields"]["geopoint"]
#     filterList=[]
#     for i in range(0,len(resturantsZip)) :
#         url="https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q="+resturantsZip[i][4].split(", ")[-1]
#         req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
#         webpage=urlopen(req).read()
#         resturantsLocation=json.loads(webpage)
#         resturantsLL=resturantsLocation["records"][0]["fields"]["geopoint"]
#         result=distanceInkm(customerLL[0],customerLL[1],resturantsLL[0],resturantsLL[1])
#         if(result<16):
#             filterList.append(resturantsZip[i])
#     return filterList
def distanceInkm (lat1,lon1,lat2,lon2):
    p = pi/180
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p) * cos(lat2*p) * (1-cos((lon2-lon1)*p))/2
    return 12742 * asin(sqrt(a))
def distanceInmi(lat1,lon1,lat2,lon2):
    return distanceInkm(lat1,lon1,lat2,lon2) * 0.621371192 