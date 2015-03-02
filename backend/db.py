import math
import pymongo
from pymongo import GEO2D
from bson import BSON
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

	def getUserData(self,uID):
		return MongoInstance.client['bxbUsers']['userdata'].find_one({'uID':uID}, {'_id': 0})		

	############################
	# Goal
	############################
	def getGoal(self,uID):
		if MongoInstance.client['bitbybit']['users'].find_one({'uID': uID}):
			return MongoInstance.client['bitbybit']['users'].find_one({'uID': uID}, {'_id': 0})
		else:
			return False

	def postGoal(self, uID, goal):
		updateFields = {}
		updateFields['goal'] = {}
		timestamp = int(time.time())
		oldGoal = MongoInstance.client['bitbybit']['users'].find_one({'uID': uID}, {'_id': 0})['goal']
		cmpResult = cmp(oldGoal,json.loads(goal))

		# print goal
		x =  json.loads(goal)
		for item in x:
			# print item + ' :  '+str(x[item])
			updateFields['goal'][item] = x[item]

		if cmpResult != 0:
			MongoInstance.client['bitbybit']['users'].update({'uID':uID}, {"$set": updateFields}, upsert=True)
			MongoInstance.client['bitbybit']['usersArchive'].insert({'uID':uID, 'goal':updateFields['goal'],'time':timestamp})
			return MongoInstance.client['bitbybit']['users'].find_one({'uID': uID}, {'_id': 0})
		else:
			return 'noChange'

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
					results[uID]['firstName'] = userData['name']

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

		stringResults = 'email,firstName,workshop1,workshop2,workshop3,workshop4,workshop5\n'
		for result in results:
			stringResults = stringResults + results[result]['email']
			stringResults = stringResults + ',' + results[result]['firstName']
			for workshop in results[result]['workshops']:
				stringResults = stringResults  + ',' + str(workshop)
			stringResults = stringResults + '\n'


		return  stringResults
		# return results


	def admindata(self):
		cursor = MongoInstance.client['bitbybit']['users'].find({}, {'_id': 0})
		usersArray = []
		for user in cursor:
			# print MongoInstance.client['bitbybit']['adminresponse'].find({'uID':user['uID']}).sort([('time', -1)]).limit(1)[0]['approved']
			try:
				userObject = {}
				userObject['uID'] = user['uID']
				userObject['want'] = user['goal']['want']
				userObject['because'] = user['goal']['because']
				userObject['then'] = user['goal']['then']
				userObject['blurb'] = user['goal']['blurb']
				userObject['reviewHistory'] = []
				try:
					historyCursor = MongoInstance.client['bitbybit']['adminresponse'].find({'uID':user['uID']}, {'_id': 0, 'uID':0}).sort([('time', -1)])
					for item in historyCursor:
						userObject['reviewHistory'].append(item)
				except:
					print 'No Review History'
				usersArray.append(userObject)
			except:
				print "Didn't have necessary fields"
		return usersArray

	def adminemail(self,uID, messageText, reviewer):
		userData = MongoInstance.client['bxbUsers']['userdata'].find_one({'uID':uID}, {'_id': 0})
		userEmail = userData['user']
		userName = userData['name']

		sg = sendgrid.SendGridClient('BITxBIT-ML', 'kevinlives4pizza')

		# print messageText
		# # print "-------"
		# # print decode(messageText)

		message = sendgrid.Mail()
		message.add_to(userName+' <'+userEmail+'>')
		message.set_subject('BITxBIT Notice')
		# message.set_html('<html><body><p>'+"Woof - many apologies for those two horrible email glitches. The intended message continues as follows! It's Kevin here with the BITxBIT team, and I am just checking in with you (I don't know who you are) to make sure that you're serious about your toenail challenge, as you will be asking someone else to devote their time and attention to addressing it. Your options are to be insistent about it, or to revise it, or to send me a non-anonymous email to discuss. Thanks"+'</p> <p>Please visit http://bitxbit.media.mit.edu to update your information.</p><h3>NOTE: This email is completely anonymous.  Our admin interface never reveals your name, email, or any identifying information. Our backend handles all email addresses and we delete all records of having sent this message to you. If you reply to this email - we will of course then know your identity. </h3></body></html>')
		message.set_html('<html><body><p>'+urllib.unquote(messageText)+'</p> <p>Please visit http://bitxbit.media.mit.edu to update your information.</p><h3>NOTE: This email is completely anonymous.  Our admin interface never reveals your name, email, or any identifying information. Our backend handles all email addresses and we delete all records of having sent this message to you. If you reply to this email - we will of course then know your identity. </h3></body></html>')
		# message.set_text(messageText)
		message.set_from('BITxBIT Team <bitxbit@media.mit.edu>')
		message.set_replyto('slavin@media.mit.edu')
		status, msg = sg.send(message)

		# status = 200
		# msg = "{'message':'success'}"

		timestamp = int(time.time())
		goal = MongoInstance.client['bitbybit']['users'].find_one({'uID': uID})['goal']
		MongoInstance.client['bitbybit']['adminresponse'].insert({'uID':uID, 'goal':goal, 'message':urllib.unquote(messageText), 'reviewer':reviewer,'time':timestamp, 'approved':False})
		return [status, msg]

	def adminapprove(self,uID,reviewer):
		timestamp = int(time.time())
		goal = MongoInstance.client['bitbybit']['users'].find_one({'uID': uID})['goal']
		MongoInstance.client['bitbybit']['adminresponse'].insert({'uID':uID, 'goal':goal, 'reviewer':reviewer, 'time':timestamp, 'approved':True})
		return '200: approved'

	# def getAdminApproval(self, uID):
	# 	try:
	# 		return MongoInstance.client['bitbybit']['adminresponse'].find_one({$query: {'uID':uID}, $orderby: {'time': -1}})
	# 	except:
	# 		return 'nodata'




	# Client corresponding to a single connection
	@property
	def client(self):
		if not hasattr(self, '_client'):
			self._client = pymongo.MongoClient(host='localhost:27017')
		return self._client

# A Singleton Object
MongoInstance = mongoInstance()
