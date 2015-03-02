import pymongo
import json
import pandas as pd
import time
import urllib, urllib2, Cookie
import hashlib


MATCH_FILE = "./matches-input-6.csv"
DEBUG = True

def addUserDataIfNeeded(uID,email,name,image):
	if not c_userData.find_one({'uID':uID}):
		if DEBUG: print "\tcould not find in user data db, adding"
		updateFields = {}
		updateFields['uID'] = uID
		updateFields['user'] = email
		updateFields['name'] = name
		updateFields['image'] = image

		c_userData.update({'uID':uID}, {"$set": updateFields}, upsert=True)

def addUserGoalIfNeeded(uID):
	if not c_users.find_one({'uID':uID}):
		if DEBUG: print "\tcould not find in user goal db, adding"
		updateFields = {}
		updateFields['uID'] = uID
		updateFields['goal'] = { "then" : "", "workshops" : [ False, False, False, False, False ], "because" : "", "want" : "", "blurb" : [ "blank", "blank", "blank", "blank", "blank", "blank", "blank" ] }

		c_users.update({'uID':uID}, {"$set": updateFields}, upsert=True)

def addPartnerAndWorkshop(uID, partner_uID, workshop):
	updateFields = {}
	updateFields['partner_uID'] = partner_uID
	updateFields['workshop'] = workshop

	c_users.update({'uID':uID}, {"$set": updateFields}, upsert=True)

def getPersonData(username):
	try:
		if DEBUG: print "In getPersonData, trying to find user", username
		req2 = urllib2.Request('http://data.media.mit.edu/spm/contacts/json?username='+username)
		# req2.add_header('Cookie', cookie)
		r2 = urllib2.urlopen(req2)
		x = r2.read()
		name = json.loads(x)['profile']['first_name']
		image = json.loads(x)['profile']['picture_url']
		if image == "":
			image = 'http://pldb.media.mit.edu/research/images/nophoto.gif'
	except:
		name = '?'
		image = 'http://pldb.media.mit.edu/research/images/nophoto.gif'

	return name,image

def processRow(username, partner_username, workshop):
	# username = row.ix[0,"username"]
	# partner_username = row.ix[1,' match username']
	# workshop = row.ix[2, ' workshop']

	partner_username = partner_username.strip()

	if DEBUG: print "in processRow for user", username, "partner", partner_username, "workshop", workshop

	email = username + "@media.mit.edu"
	name, image = getPersonData(username)

	if DEBUG: print "\tA user was returned for", username + ". Their name is", name

	#NOTE: assuming all people have @media address
	hash_object = hashlib.sha1(email)
	uID = hash_object.hexdigest()

	addUserDataIfNeeded(uID,email,name,image)
	addUserGoalIfNeeded(uID)

	p_email = partner_username + "@media.mit.edu"
	p_name, p_image = getPersonData(partner_username)
	p_hash_object = hashlib.sha1(p_email)
	p_uID = p_hash_object.hexdigest()

	if DEBUG: print "\tTheir partner's name is", p_name

	addUserDataIfNeeded(p_uID,p_email,p_name,p_image)
	addUserGoalIfNeeded(p_uID)

	addPartnerAndWorkshop(uID,p_uID,workshop)


if __name__ == "__main__":
	connection = pymongo.Connection(host='127.0.0.1', port=27017)

	try:
		db_goals = connection.bitbybit #goals
		db_users = connection.bxbUsers #media lab user data
	except:
		print "Can't seem to find the meteor database"

	global c_users
	c_users = db_goals.users
	global c_userData
	c_userData = db_users.userdata

	matches = pd.DataFrame.from_csv(MATCH_FILE)
	matches = matches.reset_index()

	if DEBUG: print "input matches, there are ", len(matches), "pairs"

	#matches.apply(processRow,axis=1)

	users = matches['username'].tolist()
	partners = matches[' match username'].tolist()
	workshops = matches[' workshop'].tolist()
	for i in range(len(users)):
		processRow(users[i], partners[i], workshops[i])



