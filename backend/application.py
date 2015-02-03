#!/usr/bin/python
'''
BitByBit Restful API
'''
import json
import time

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
# Goal
############################
goalGetParser = reqparse.RequestParser()
goalGetParser.add_argument('uID', type=str, required=True)

goalPostParser = reqparse.RequestParser()
goalPostParser.add_argument('uID', type=str, required=True)
goalPostParser.add_argument('goal', type=str, required=True)

goalDeleteParser = reqparse.RequestParser()
goalDeleteParser.add_argument('uID', type=str, required=True)

class Goal(Resource):
	def get(self):
		args = goalGetParser.parse_args()
		uID = args.get('uID')
		return MongoInstance.getGoal(uID)
	def post(self):
		args = goalPostParser.parse_args()
		uID = args.get('uID')
		goal = args.get('goal')
		return MongoInstance.postGoal(uID, goal)
	def delete(self):
		args = goalDeleteParser.parse_args()
		uID = args.get('uID')
		return MongoInstance.deleteGoal(uID)
api.add_resource(Goal, '/api/goal')


############################
# User
############################
userGetParser = reqparse.RequestParser()
userGetParser.add_argument('uID', type=str, required=True)

userPostParser = reqparse.RequestParser()
userPostParser.add_argument('uID', type=str, required=True)

userDeleteParser = reqparse.RequestParser()
userDeleteParser.add_argument('uID', type=str, required=True)

class User(Resource):
	def get(self):
		args = userGetParser.parse_args()
		uID = args.get('uID')
		return MongoInstance.getUser(uID)
	def post(self):
		args = userPostParser.parse_args()
		uID = args.get('uID')
		return MongoInstance.postUser(uID)
	def delete(self):
		args = userDeleteParser.parse_args()
		uID = args.get('uID')
		return MongoInstance.deleteUser(uID)
api.add_resource(User, '/api/user')

############################
# Get All Users
############################
# userGetParser = reqparse.RequestParser()
# userGetParser.add_argument('uID', type=str, required=True)

class AllUsers(Resource):
	def get(self):
		return MongoInstance.allUsers()
api.add_resource(AllUsers, '/api/allusers')



if __name__ == '__main__':
    application.run(host = '0.0.0.0', debug=True)
    #application.run(debug="true", port=PORT)
