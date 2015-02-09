import pymongo
import json

import time

connection = pymongo.Connection(host='127.0.0.1', port=27017)

try:
	db = connection.bitbybit
except:
	print "Can't seem to find the meteor database"

c_users = db.users
c_usersArchive = db.usersArchive

x = c_users.find({})
for item in x:
	print item['uID']
	uID = item['uID']
	updateFields = {}
	updateFields['goal'] = {}
	try:
		d =  json.loads(item['goal'])
		for thing in d:
			# print item
			# print thing + ' :  '+str(d[thing])
			updateFields['goal'][thing] = d[thing]
		print updateFields
		c_users.update({'uID':uID}, {"$set": updateFields}, upsert=True)
	except:
		print "users : Error in JSON loads probably"

	

x = c_usersArchive.find({})
for item in x:
	print item['uID']
	uID = item['uID']
	time = item['time']
	updateFields = {}
	updateFields['goal'] = {}
	try:
		d =  json.loads(item['goal'])
		for thing in d:
			# print item
			# print thing + ' :  '+str(d[thing])
			updateFields['goal'][thing] = d[thing]
		print updateFields
		c_usersArchive.update({'uID':uID, 'time':time}, {"$set": updateFields}, upsert=True)
	except:
		print "archive : Error in JSON loads probably"

	
