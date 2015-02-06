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
        updateFields['goal'] = goal


        MongoInstance.client['bitbybit']['users'].update({'uID':uID}, {"$set": updateFields}, upsert=True)
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
            

    



        
    # Client corresponding to a single connection
    @property
    def client(self):
        if not hasattr(self, '_client'):
            self._client = pymongo.MongoClient(host='localhost:27017')
        return self._client

# A Singleton Object
MongoInstance = mongoInstance()
