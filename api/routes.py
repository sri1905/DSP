import json

from numpy import exp
from sqlalchemy.sql.expression import false, true
from api import db, app
from flask import request, jsonify

from api.models import Collections, Schools, Books, Movies
from api.utils import getProgressList
# Routes

@app.route('/api/home', methods=['GET'])
def home():
	return '<h1>Active Backend Charlie.... !</h1>'

@app.route('/api/list', methods=['GET'])
def list_domain_items():
	domain =request.args.get('domain').strip()
	print('GOT:',domain)
	collectionSize=0

	if domain=='Schools':
		url='school'
		listItems = [{'code':sch.udise_id, 'title':sch.title} for sch in Schools.query.all()]
	elif domain=='Book Collections':
		url='collection/book'
		listItems =[{'number':collection.number, 'title':'Collection '+str(collection.number)} 
							for collection in Collections.query.filter_by(domain="book").all()]
	elif domain=='Movie Collections':
		url='collection/movie'
		listItems =[{'number':collection.number, 'title':'Collection '+str(collection.number)} 
							for collection in Collections.query.filter_by(domain="movie").all()]

	# Progress
	elif domain=="Books Progress":
		url ="collection/book"
		listItems, collectionSize =getProgressList('book')
	elif domain=="Movies Progress":
		url ="collection/movie"
		listItems, collectionSize =getProgressList('movie')

	response ={'list':listItems, 'url':url, 'domain':domain, 'collectionSize':collectionSize}
	return jsonify(response)


@app.route('/api/listCollection', methods=['GET'])
def list_collection():
	num =request.args.get('no')
	domain =request.args.get('domain').strip()

	print('GOT:', domain, num)

	collection = Collections.query.filter_by(domain=domain, number=num).first()
	
	if domain=='book':
		listItems =[{'code':book.book_id, 'title':book.title, 'done':book.done} for book in 
							Books.query.all()[collection.startIndex:collection.startIndex+collection.length]]
	elif domain=='movie':
		listItems =[{'code':movie.movie_id, 'title':movie.title, 'done':movie.done} for movie in 
							Movies.query.all()[collection.startIndex:collection.startIndex+collection.length]]

	collection ={'user':collection.userName, 'done':collection.done}
	response ={'collection':collection, 'list':listItems, 'domain':domain}
	return jsonify(response)



@app.route('/api/updateCategory', methods=['GET', 'POST'])
def update_collection():
	num =request.json.get('num')
	domain =request.json.get('domain')
	collection = Collections.query.filter_by(domain=domain, number=num).first()
	try:
		collection.userName=request.json.get('user')
		db.session.commit()
		done =true
	except Exception as e:
		print(e)
		done=false

	if done:
		collection = Collections.query.filter_by(domain=domain, number=num).first()
		collection ={'user':collection.userName, 'done':collection.done}
		return jsonify({ 'collection': collection })
	else:
		return jsonify({ 'collection': {'user':'update failed'} })

@app.route('/api/toggleItemState', methods=['GET', 'POST'])
def toggle_ItemState():
	num =request.json.get('num')
	itemID =request.json.get('itemID')
	domain =request.json.get('domain')
	collection = Collections.query.filter_by(domain=domain, number=num).first()
	itemsCompleted =json.loads(collection.itemsCompleted)

	if domain=='book':
		book =Books.query.filter_by(book_id=itemID).first()
		book.done=not book.done
		print('toggle:',book.title, book.done)

		if book.done:
			itemsCompleted.append(book.book_id)
		else:
			itemsCompleted.remove(book.book_id)
		collection.itemsCompleted=json.dumps(itemsCompleted)

		db.session.commit()

		listItems =[{'code':book.book_id, 'title':book.title, 'done':book.done} for book in 
							Books.query.all()[collection.startIndex:collection.startIndex+collection.length]]
	
	elif domain=='movie':
		movie =Movies.query.filter_by(movie_id=itemID).first()
		movie.done=not movie.done
		print('toggle:',movie.title, movie.done)
			
		if movie.done:
			itemsCompleted.append(movie.movie_id)
		else:
			itemsCompleted.remove(movie.movie_id)
		collection.itemsCompleted=json.dumps(itemsCompleted)

		db.session.commit()

		listItems =[{'code':movie.movie_id, 'title':movie.title, 'done':movie.done} for movie in 
							Movies.query.all()[collection.startIndex:collection.startIndex+collection.length]]
	
	response ={'list':listItems}
	return jsonify(response)



@app.route('/api/get_itemData', methods=['GET'])
def get_itemData():
	itemID=request.args.get('itemID').strip()
	domain=request.args.get('domain').strip()
	try:
		if domain=='school':
			item = Schools.query.filter_by(udise_id=itemID).first()
		elif domain=='book':
			item =Books.query.filter_by(book_id=itemID).first()
		elif domain=='movie':
			item =Movies.query.filter_by(movie_id=itemID).first()

		title = item.title
		categories =json.loads(item.categories)
	
	except:
		print('Failed for itemID=', itemID, 'of type', type(itemID))
		title =''
		categories = []

	return jsonify({ 'title': title, 'categories': categories })

@app.route('/api/save_categories', methods=['GET', 'POST'])
def save_categories():
	itemID=request.json.get('itemID')
	title =request.json.get('title')
	domain=request.json.get('domain')
	newCategories=request.json.get('newCategories')
	print('SAVE Categories:', domain, itemID)
	
	done = False
	if domain=='school':
		if Schools.query.filter_by(udise_id=itemID).update(dict(categories=json.dumps(newCategories)))==1:
			done = True
	
	elif domain=='book':
		title_done=False
		category_done =False
		booksTitle =newCategories['Wikipedia Title'][0]+' / '+newCategories['Wikipedia Title'][1]
		if Books.query.filter_by(book_id=itemID).update(dict(title=booksTitle)):
			title_done=True
		if Books.query.filter_by(book_id=itemID).update(dict(categories=json.dumps(newCategories)))==1:
			category_done=True
		if title_done and category_done:
			done =true

	elif domain=='movie':
		title_done=False
		category_done =False
		
		if Movies.query.filter_by(movie_id=itemID).update(dict(title=title)):
			title_done=True
		if Movies.query.filter_by(movie_id=itemID).update(dict(categories=json.dumps(newCategories)))==1:
			category_done=True
		if title_done and category_done:
			done =true

	if done:
		db.session.commit()
		return jsonify({ 'show': True })
	else:
		print("Failed to update ", itemID)#, " \nnewCategories:", newCategories, "\n\n")
		return jsonify({ 'show': False})

