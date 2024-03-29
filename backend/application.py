#!/usr/bin/python
'''
BitByBit Restful API
'''
import json
import time

import urllib, urllib2, Cookie
import hashlib

from flask import Flask, request, abort, redirect, Response, jsonify
from flask.ext.restful import Resource, Api, reqparse

from db import MongoInstance
from bson.objectid import ObjectId

application = Flask(__name__)
api = Api(application)

PORT = 8888

############################
# Once domains are set, we need to update the following to only allow access to bitbybit.me 
############################
@application.before_request
def option_autoreply():
	""" Always reply 200 on OPTIONS request """
	if request.method == 'OPTIONS':
		resp = application.make_default_options_response()

		headers = None
		if 'ACCESS_CONTROL_REQUEST_HEADERS' in request.headers:
			headers = request.headers['ACCESS_CONTROL_REQUEST_HEADERS']

		h = resp.headers

		h['Access-Control-Allow-Origin'] = request.headers['Origin']# Allow the origin which made the XHR
		h['Access-Control-Allow-Methods'] = request.headers['Access-Control-Request-Method']# Allow the actual method
		h['Access-Control-Max-Age'] = "10"# Allow for 10 seconds

		if headers is not None:        # We also keep current headers 
			h['Access-Control-Allow-Headers'] = headers

		return resp

@application.after_request
def set_allow_origin(resp):
	""" Set origin for GET, POST, PUT, DELETE requests """
	h = resp.headers
	if request.method != 'OPTIONS' and 'Origin' in request.headers: # Allow crossdomain for other HTTP Verbs
		h['Access-Control-Allow-Origin'] = request.headers['Origin']
		
	h['Access-Control-Allow-Credentials'] = 'true'
	return resp




############################
# Endpoint Specifications
############################

############################
# publicTest
############################
publicGetParser = reqparse.RequestParser()
publicGetParser.add_argument('q', type=str, required=True)
class Public(Resource):
	def get(self):
		args = publicGetParser.parse_args()
		q = args.get('q')
		# cookies = dict([e.split('=') for e in request.headers['Cookie'].replace(' ', '').split(';')])
		# print cookies
		try:
			cookie = request.headers['Cookie']
		except:
			cookie = "No Cookies!"
		return "You just did the dang public, sir! You said " + q + " !!!! cookies: " + cookie
		# return MongoInstance.getPublic(uID)
api.add_resource(Public, '/api/public/test')

############################
# privateTest
############################
privateGetParser = reqparse.RequestParser()
privateGetParser.add_argument('q', type=str, required=True)
class Private(Resource):
	def get(self):
		args = privateGetParser.parse_args()
		q = args.get('q')
		# cookies = dict([e.split('=') for e in request.headers['Cookie'].replace(' ', '').split(';')])
		# print cookies
		try:
			cookie = request.headers['Cookie']
		except:
			cookie = "No Cookies!"
		return "Awww Private in this biz! You said " + q + " !!!! cookies: " + cookie
		# return MongoInstance.getPublic(uID)
api.add_resource(Private, '/api/private/test')


def getUIDUserFromCookie():
	try:
		cookie = request.headers['Cookie']
		req = urllib2.Request('http://www.media.mit.edu/login/valid/index.html')
		req.add_header('Cookie', cookie)
		r = urllib2.urlopen(req)
		# print r.read()
		if r.read()[:4]=='true':
			# print 'yep'
			c = Cookie.SimpleCookie()
			# print hcook
			c.load(str(cookie))
			mlCookie = c['MediaLabUser'].value
			user = urllib.unquote(mlCookie).split(';')[0]
			hash_object = hashlib.sha1(user)
			uID = hash_object.hexdigest()

			return uID,user
		else:
			return None,None
	except:
		cookie = "No Cookies!"
		return None,None

def getUsername(user):
	if len(user.split('@media.mit.edu')) == 2:
		username = user.split('@media.mit.edu')[0]
	else:
		username = user
	return username

def getUserImageName(username):
	try:
		req2 = urllib2.Request('http://data.media.mit.edu/spm/contacts/json?username='+username)
		# req2.add_header('Cookie', cookie)
		r2 = urllib2.urlopen(req2)
		x = r2.read()
		name = json.loads(x)['profile']['first_name']
		image = json.loads(x)['profile']['picture_url']
		if image == "":
			image = 'http://pldb.media.mit.edu/research/images/nophoto.gif'
	except:
		name = 'You'
		image = 'http://pldb.media.mit.edu/research/images/nophoto.gif'
	return name,image

############################
# Goal
############################
goalGetParser = reqparse.RequestParser()
# goalGetParser.add_argument('uID', type=str, required=True)

goalPostParser = reqparse.RequestParser()
# goalPostParser.add_argument('uID', type=str, required=True)
goalPostParser.add_argument('goal', type=str, required=True)

goalDeleteParser = reqparse.RequestParser()
goalDeleteParser.add_argument('uID', type=str, required=True)

class Goal(Resource):
	def get(self):
		args = goalGetParser.parse_args()


		##############
		# For local Debug and Develop
		##############
		# user = 'trich@media.mit.edu'
		# username = 'trich'
		# hash_object = hashlib.sha1(user)
		# uID = hash_object.hexdigest()
		# name = 'TestYou'
		# image = 'http://pldb.media.mit.edu/research/images/nophoto.gif'

		# # MongoInstance.addUserData(uID,user,name,image)
		# # return {'name':name, 'image':image, 'goal':MongoInstance.getGoal(uID)}
		# MongoInstance.addUserData(uID,user,name,image)
		# user  = MongoInstance.getGoal(uID)
		# goal = user['goal']
		# partner_uID = user['partner_uID']
		# workshop = user['workshop']
		# partner = MongoInstance.getGoal(partner_uID)
		# partner_userData = MongoInstance.getUserData(partner_uID)
		# partner['name'] = partner_userData['name']
		# partner['email'] = partner_userData['user']
		# partner['image'] = partner_userData['image']
		# return {'name':name, 'image':image, 'goal':goal, 'workshop':workshop,'partner':partner}
		##############
		# End Debug Section
		##############

		uID,user = getUIDUserFromCookie()
		if uID is not None:
			username = getUsername(user)
			name, image = getUserImageName(username)

			MongoInstance.addUserData(uID,user,name,image)
			user = MongoInstance.getGoal(uID)
			goal = user['goal']
			partner_uID = user['partner_uID']
			workshop = user['workshop']
			partner = MongoInstance.getGoal(partner_uID)
			partner_userData = MongoInstance.getUserData(partner_uID)
			partner['name'] = partner_userData['name']
			partner['email'] = partner_userData['user']
			partner['image'] = partner_userData['image']
			return {'name':name, 'image':image, 'goal':goal, 'workshop':workshop,'partner':partner}
		else:
			return 'redirect'
			# return redirect("http://www.media.mit.edu/login?destination=bitxbit.media.mit.edu%2Fteam&previous=bitxbit.media.mit.edu", code=302)

		
	def post(self):
		args = goalPostParser.parse_args()
		# uID = args.get('uID')
		goal = args.get('goal')
		# print goal
		

		##############
		# For local Debug and Develop
		##############
		# user = 'trich@media.mit.edu'
		# username = 'trich'
		# hash_object = hashlib.sha1(user)
		# uID = hash_object.hexdigest()
		# name = 'TestYou'
		# image = 'http://pldb.media.mit.edu/research/images/nophoto.gif'

		# return MongoInstance.postGoal(uID, goal)
		##############
		# End Debug Section
		##############

		uID,user = getUIDUserFromCookie()
		if uID is not None:
			return MongoInstance.postGoal(uID, goal)
		else:
			return 'redirect'

		
	def delete(self):
		args = goalDeleteParser.parse_args()
		uID = args.get('uID')
		return MongoInstance.deleteGoal(uID)
api.add_resource(Goal, '/api/private/goal')

############################
# Survey
############################
surveyGetParser = reqparse.RequestParser()
surveyGetParser.add_argument('survey_num', type=str, required=True)

surveyPostParser = reqparse.RequestParser()
surveyPostParser.add_argument('survey', type=str, required=True)
surveyPostParser.add_argument('survey_num', type=str, required=True)
class Survey(Resource):
	def get(self):
		args = surveyGetParser.parse_args()
		survey_num = args.get('survey_num')
		print "in get survey, survey_num is:", survey_num

		uID,user = getUIDUserFromCookie()
		if uID is not None:
			username = getUsername(user)
			name, image = getUserImageName(username)
			MongoInstance.addUserData(uID,user,name,image)

			survey = MongoInstance.getSurvey(uID, survey_num)
			return {'name':name, 'image':image, 'survey_num':survey_num, 'survey':survey}
		else:
			return 'redirect'

	def post(self):
		args = surveyPostParser.parse_args()
		survey = args.get('survey')
		survey_num = args.get('survey_num')
		print "in post survey, survey is", survey

		uID,user = getUIDUserFromCookie()
		if uID is not None:
			return MongoInstance.postSurvey(uID, survey, survey_num)
		else:
			return 'redirect'


api.add_resource(Survey, '/api/private/survey')

# ############################
# # User
# ############################
# userGetParser = reqparse.RequestParser()
# userGetParser.add_argument('uID', type=str, required=True)

# userPostParser = reqparse.RequestParser()
# userPostParser.add_argument('uID', type=str, required=True)

# userDeleteParser = reqparse.RequestParser()
# userDeleteParser.add_argument('uID', type=str, required=True)

# class User(Resource):
# 	def get(self):
# 		args = userGetParser.parse_args()
# 		uID = args.get('uID')
# 		return MongoInstance.getUser(uID)
# 	def post(self):
# 		args = userPostParser.parse_args()
# 		uID = args.get('uID')
# 		return MongoInstance.postUser(uID)
# 	def delete(self):
# 		args = userDeleteParser.parse_args()
# 		uID = args.get('uID') 
# 		return MongoInstance.deleteUser(uID)
# api.add_resource(User, '/api/user')

############################
# Get All Users
############################
# userGetParser = reqparse.RequestParser()
# userGetParser.add_argument('uID', type=str, required=True)

class AllUsers(Resource):
	def get(self):
		return MongoInstance.allUsers()
api.add_resource(AllUsers, '/api/allusers')




def admin_cookie(fn):
	def decorated_fn(*args, **kwargs):
		cookie = request.headers['Cookie']
		req = urllib2.Request('http://www.media.mit.edu/login/valid/index.html')
		req.add_header('Cookie', cookie)
		r = urllib2.urlopen(req)
		if r.read()[:4]=='true':
			c = Cookie.SimpleCookie()
			c.load(str(cookie))
			mlCookie = c['MediaLabUser'].value
			user = urllib.unquote(mlCookie).split(';')[0]
			hash_object = hashlib.sha1(user)
			uID = hash_object.hexdigest()
			
			if len(user.split('@media.mit.edu')) == 2:
				username = user.split('@media.mit.edu')[0]
				if username == "jaquesn" or username == "trich" or username == "cvx" or username == 'slavin' or username == 'kdinakar':
					return fn(*args, **kwargs)
		return "Invalid Key"
	return decorated_fn

############################
# Get Workshops
############################
class Workshops(Resource):
	@admin_cookie
	def get(self):
			return MongoInstance.workshops()

api.add_resource(Workshops, '/api/private/workshops')

############################
# Get AdminData
############################
class AdminData(Resource):
	@admin_cookie
	def get(self):
			return MongoInstance.admindata()

api.add_resource(AdminData, '/api/private/admindata')

############################
# AdminEmail
############################
adminEmailPostParser = reqparse.RequestParser()
adminEmailPostParser.add_argument('uID', type=str, required=True)
adminEmailPostParser.add_argument('message', type=str, required=True)

class AdminEmail(Resource):
	@admin_cookie
	def post(self):
		cookie = request.headers['Cookie']
		c = Cookie.SimpleCookie()
		c.load(str(cookie))
		mlCookie = c['MediaLabUser'].value
		user = urllib.unquote(mlCookie).split(';')[0]
		reviewer = user.split('@media.mit.edu')[0]

		args = adminEmailPostParser.parse_args()
		uID = args.get('uID')
		message = args.get('message')
		return MongoInstance.adminemail(uID, message, reviewer)

api.add_resource(AdminEmail, '/api/private/adminemail')

############################
# AdminApprove
############################
adminApprovePostParser = reqparse.RequestParser()
adminApprovePostParser.add_argument('uID', type=str, required=True)
class AdminApprove(Resource):
	@admin_cookie
	def post(self):
		cookie = request.headers['Cookie']
		c = Cookie.SimpleCookie()
		c.load(str(cookie))
		mlCookie = c['MediaLabUser'].value
		user = urllib.unquote(mlCookie).split(';')[0]
		reviewer = user.split('@media.mit.edu')[0]

		args = adminApprovePostParser.parse_args()
		uID = args.get('uID')
		return MongoInstance.adminapprove(uID, reviewer)

api.add_resource(AdminApprove, '/api/private/adminapprove')
	




if __name__ == '__main__':
	# application.run(host = '0.0.0.0', debug=True)
	# application.run(host = 'localhost.media.mit.edu', debug=True)
	application.run(host = 'localhost', debug=True)
	#application.run(debug="true", port=PORT)
