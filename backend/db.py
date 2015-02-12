import math
import pymongo
from pymongo import GEO2D
from bson.objectid import ObjectId
import os
import urllib
import random
import time
import json
from operator import itemgetter
import random
import sys
import sendgrid


class mongoInstance(object):


	def addUserData(self, uID,user,name,image):
		updateFields = {}
		updateFields['uID'] = uID
		updateFields['user'] = user
		updateFields['name'] = name
		updateFields['image'] = image

		MongoInstance.client['bxbUsers']['userdata'].update({'uID':uID}, {"$set": updateFields}, upsert=True)

	############################
	# Goal
	############################
	def getGoal(self,uID):
		if MongoInstance.client['bitbybit']['users'].find_one({'uID': uID}):
			return MongoInstance.client['bitbybit']['users'].find_one({'uID': uID})['goal']
		else:
			return False

	def postGoal(self, uID, goal):
		updateFields = {}
		updateFields['goal'] = {}
		timestamp = int(time.time())

		# print goal
		x =  json.loads(goal)
		for item in x:
			# print item + ' :  '+str(x[item])
			updateFields['goal'][item] = x[item]

		MongoInstance.client['bitbybit']['users'].update({'uID':uID}, {"$set": updateFields}, upsert=True)
		MongoInstance.client['bitbybit']['usersArchive'].insert({'uID':uID, 'goal':updateFields['goal'],'time':timestamp})
		return MongoInstance.client['bitbybit']['users'].find_one({'uID': uID}, {'_id': 0})

		# thing = MongoInstance.client['bitbybit']['users'].find_one({'uID': uID}, {'_id': 0})
		# print thing
		# print json.loads(thing['goal'])['want']
		# # print json.loads(thing)
		# # print json.loads(thing)['want']



	def deleteGoal(self, uID):
		updateFields = {}
		updateFields['goal'] = ''
		MongoInstance.client['bitbybit']['users'].update({'uID':uID}, {"$set": updateFields}, upsert=False)
		return {'goalDeleted': True}

	############################
	# User
	############################
	def getUser(self,uID):
		return MongoInstance.client['bitbybit']['users'].find_one({'uID': uID}, {'_id': 0})

	def postUser(self, uID):
		updateFields = {}
		updateFields['uID'] = uID
		MongoInstance.client['bitbybit']['users'].update({'uID':uID}, {"$set": updateFields}, upsert=True)
		return MongoInstance.client['bitbybit']['users'].find_one({'uID': uID}, {'_id': 0})

	def deleteUser(self, uID):
		MongoInstance.client['bitbybit']['users'].remove({'uID': uID})
		return {'userDeleted': True}


	############################
	# Get All Users
	############################
	def allUsers(self):
		cursor = MongoInstance.client['bitbybit']['users'].find({}, {'_id': 0})
		results = []
		for result in cursor:
			results.append(result)
		return results

	def workshops(self):
		cursor = MongoInstance.client['bitbybit']['users'].find({}, {'_id': 0})
		results = {}
		for user in cursor:
			uID = user['uID']
			try:
				userData = MongoInstance.client['bxbUsers']['userdata'].find_one({'uID':uID}, {'_id': 0})
				if userData:
					results[uID] = {}
					results[uID]['workshops'] = user['goal']['workshops']
					results[uID]['email'] = userData['user']

			except:
				# del results[uID]
				print "That was a fake one"

		# cursor2 = MongoInstance.client['bxbUsers']['userdata'].find({}, {'_id': 0})
		# for user in cursor2:
		# 	uID = user['uID']
		# 	try:
		# 		results[uID]['email'] = user['user']
		# 	except:
		# 		print "That user had no data"

		stringResults = 'email,workshop1,workshop2,workshop3,workshop4,workshop5\n'
		for result in results:
			stringResults = stringResults + results[result]['email']
			for workshop in results[result]['workshops']:
				stringResults = stringResults  + ',' + str(workshop)
			stringResults = stringResults + '\n'


		return  stringResults
		# return results


	def admindata(self):
		cursor = MongoInstance.client['bitbybit']['users'].find({}, {'_id': 0})
		usersArray = []
		for user in cursor:
			try:
				userObject = {}
				userObject['uID'] = user['uID']
				userObject['want'] = user['goal']['want']
				userObject['because'] = user['goal']['because']
				userObject['then'] = user['goal']['then']
				userObject['blurb'] = user['goal']['blurb']
				usersArray.append(userObject)
			except:
				print "Didn't have necessary fields"
		return usersArray

	def adminemail(self,uID, messageText):
		sg = sendgrid.SendGridClient('BITxBIT-ML', 'kevinlives4pizza')

		message = sendgrid.Mail()
		message.add_to('BITxBIT Team <bitxbit@media.mit.edu>')
		message.set_subject('BITxBIT Notice')
		message.set_html('<html><body><p>'+messageText+'</p> <p>Please visit http://bitxbit.media.mit.edu to update your information.</p><h3>NOTE: This email is completely anonymous.  Our admin interface never reveals your name, email, or any identifying information. Our backend handles all email addresses and we delete all records of having sent this message to you. If you reply to this email - we will of course then know your identity. </h3></body></html>')
		# message.set_text(messageText)
		message.set_from('BITxBIT Team <bitxbit@media.mit.edu>')
		status, msg = sg.send(message)
		return [status, msg]




	# Client corresponding to a single connection
	@property
	def client(self):
		if not hasattr(self, '_client'):
			self._client = pymongo.MongoClient(host='localhost:27017')
		return self._client

# A Singleton Object
MongoInstance = mongoInstance()
