import pandas as pd
import re, ast, pickle, json
from pandas.core.indexing import IndexSlice

from sqlalchemy.sql.expression import false, true
from api import db, pickleFolder
from api.models import Schools, Books, Movies, Collections

# Custom parser to parse the values in a dictionary
def parseDict(dictval):
	listval =[]
	for key in dictval.keys():
		listval.append(key+' : '+dictval[key])
	return listval

# Parse function for any json object presentend as a string
# Make the json string readable
def parse(stringval, key):
	returnval =''
	done=True
	try:
		val =ast.literal_eval(stringval)
		returnval = json.dumps(val, indent=2, ensure_ascii=False).encode('utf8').decode()

	except:
		if stringval==None:
			returnval=''
		else:
			done=False
			returnval=stringval
		
	return returnval, done

# Wrapper for parser (above function)
def format(stringval, key, exception):
	if exception:
		return str(stringval), True
	parsedVal, done = parse(stringval, key)
	parsedVal=str(parsedVal)
	
	if ',' in parsedVal and '\n' not in parsedVal:
		parsedVal = re.sub(r', ?', ',\n', parsedVal)
		return parsedVal, done
	
	return parsedVal, done

def populateMovies():
	collection_size =500
	movies =pd.read_excel('./data/movies.xlsx')
	movies =movies.where(pd.notnull(movies), None)
	print(movies.columns)
	
	fbad=open('0error.txt', 'w')

	# COLUMNS
	columnNames =['Synopsis', 'Songs', 'production_company', 'cast', 'stars', 'storyline', 'tagline', 'trivia', 'Nominee', 'Winner']
	# excepted attributes (columns) from formating
	exceptions = ['Synopsis', 'production_company', 'cast', 'storyline', 'tagline', 'trivia', 'stars']
	
	print('\nDeleted '+str(Movies.query.delete())+' Movies(s) !')
	print('Deleted '+str(Collections.query.filter_by(domain="movie").delete())+' Collection(s) !\n')
	
	icnt=Movies.query.count(); ccnt=0
	start=0; end=movies.shape[0]
	for index in range(start, end):
		if index==start+5000:
			break
		# print(index)
		movie = movies.iloc[index]
		title,_ =format(movie.Title, 'Title', True)
		categories ={}

		badKeys = []
		
		if type(title)!=str:
			badKeys.append('Title is '+str(type(title)))
		
		title=str(title)
		i=0 #item index
		for i in range(len(columnNames)):
			en =columnNames[i]; te=columnNames[i]+'.1'

			#Correct the data
			if en=='cast' and movie[en]:
				movie.at[en]=movie[en].replace(';', ',\n')
				movie.at[te]=movie[te].replace(';', ',\n')
			
			key = ' '.join([w.capitalize() for w in en.lower().replace('_', ' ').split()])
			enValue, done =format(movie[en], key, en in exceptions)
			if not done:
				badKeys.append(key+'_english')
			teValue, done =format(movie[te], key, en in exceptions)
			if not done:
				badKeys.append(key+'_telugu')

			categories[key]=[enValue, teValue]
		
		#Write to file
		if len(badKeys):
			print(index)
			fbad.write('\n\n'+str(index)+' : '+title)
		# else:
		# 	print(index, ' ok')
		for bk in badKeys:
			print('\t', bk)
			fbad.write('\n\t'+bk)

		# First add collection
		if icnt%collection_size==0:
			collection = Collections(number=(icnt/collection_size)+1, 
											domain="movie", startIndex=icnt, 
											length=collection_size)
			db.session.add(collection)
			ccnt+=1
			print('Collection', ccnt, 'added !')
			print('\tstarting at', icnt)
		
		#Then add movies
		#No issues
		if badKeys==[]:
			obj = Movies(movie_id=icnt+1, title=title, categories=json.dumps(categories))
			db.session.add(obj)
			icnt+=1
		

	print('Total\t'+str(Movies.query.count())+' movie(s)!\n\t'+str(ccnt)+' collection(s)\n')
	db.session.commit()
	fbad.write('\n')
	fbad.close()

def populateBooks():
	bcnt=0; ccnt=0
	collection_size =100
	
	books =pd.read_excel('./data/books.xlsx')
	books =books.where(pd.notnull(books), None)
	
	# COLUMNS
	columnNames =[
		'WIKIPEDIA_TITLE_ENGLISH', 'WIKIPEDIA_TITLE_TELUGU', 
		'SUBTITLE_ENGLISH', 'SUBTITLE_TELUGU', 
		'BOOK_SUMMARY_ENGLISH', 'BOOK_SUMMARY_TELUGU', 
		'BOOK_EDITIONS_ENGLISH', 'BOOK_EDITIONS_TELUGU',
		'BOOK_SERIES_ENGLISH', 'BOOK_SERIES_TELUGU', 
		'BOOK_AWARDS_ENGLISH','BOOK_AWARDS_TELUGU', 
		'AUTHOR_AWARDS_ENGLISH', 'AUTHOR_AWARDS_TELUGU',
		'AUTHOR_NOTABLE_WORKS_ENGLISH', 'AUTHOR_NOTABLE_WORKS_TELUGU',
		'AUTHOR_OTHER_WORKS_ENGLISH', 'AUTHOR_OTHER_WORKS_TELUGU',
		'PUBLISHER_COLLECTION_ENGLISH', 'PUBLISHER_COLLECTION_TELUGU']
	# excepted attributes (columns) from formating
	exceptions = ['Book Summary', 'Wikipedia Title', 'Subtitle']

	print('\nDeleted '+str(Books.query.delete())+' Book(s) !')
	print('Deleted '+str(Collections.query.filter_by(domain="book").delete())+' Collection(s) !', flush=True)
	db.session.commit()
	for index, book in books.iterrows():
		print(index, flush=True)
		title =format(book.WIKIPEDIA_TITLE_ENGLISH, 'Wikipedia Title', 'Wikipedia Title' in exceptions)[0]+' / '+format(book.WIKIPEDIA_TITLE_TELUGU, 'Wikipedia Title', 'Wikipedia Title' in exceptions)[0]
		categories ={}
		
		i=0
		while i<len(columnNames):
			en =columnNames[i]; te =columnNames[i+1]
			key = ' '.join([w.capitalize() for w in en.lower().replace('_', ' ').split()[:-1]])
			categories[key]=[format(book[en], key, key in exceptions)[0], format(book[te], key, key in exceptions)[0]]

			i+=2

		obj = Books(book_id=index+1, title=title, categories=json.dumps(categories))
		db.session.add(obj)
		bcnt+=1

		if index%collection_size==0:
			collection = Collections(number=(index/collection_size)+1, domain="book", startIndex=index)
			db.session.add(collection)
			ccnt+=1
	
	print('Added '+str(bcnt)+' book(s)!\n'+str(ccnt)+' collection(s)\n')
	db.session.commit()

def	populateSchools():
	print('\nDeleted '+str(Schools.query.delete())+' School(s) !')
	part100 = pickle.load(open(pickleFolder+'parts100.pkl', 'rb')) #this is a dataframe
	cnt = 0
	for row in part100.to_dict('records'):
		categories = [('Location', row['Location'].strip()), ('Details', row['Details'].strip()), ('Admissions', row['Admissions'].strip()), ('Academics', row['Academics'].strip()),
						('Faculty', row['Faculty'].strip()), ('Counts', row['Counts'].strip()), ('Achievements', row['Achievements'].strip()), ('Facilities', row['Facilities'].strip()),
						('Extracurricular', row['Extracurricular'].strip()), ('History', row['History'].strip()), ('Ending', row['Ending'].strip()), ('References', '\n\n'+row['References'].strip())
					]
		wc = len(' '.join([text for _, text in categories]))
		title = ' '.join(row['Title'].strip().split())
		obj = Schools(page_id=row['PageID'], udise_id=row['Code'], title=title, 
							categories=json.dumps(categories), wordCount=wc)

		db.session.add(obj)
		cnt+=1
	
	print('Added '+str(cnt)+' school(s)!')
	db.session.commit()

if __name__=="__main__":
	# populateSchools()
	populateBooks()

	# populateMovies()




# IN try of parse()
		# if type(val)==list:
		# 	listval=val
		# elif type(val)==dict:
		# 	listval =parseDict(val)	
		# elif type(val) in [str, bool]:
		# 	return val
		# else:
		# 	print('unknown type:', type(val), ' @ ', key, ':', val)
		# 	return val

		# if len(listval)==0:
		# 	return ""
		# else:
		# 	for i in range(len(listval)):
		# 		if type(listval[i])==list:
		# 			listval[i]=', '.join(listval[i])+'\n'
		# 		else:
		# 			listval[i]=listval[i]+', '

		# # print('astSuccess:', ' '.join(listval))
		# finalval =''.join(listval).strip().strip(',')
		# print('finalval:', finalval)
		# # BRUTE FORCE pretty print:
		# if any(c in finalval for c in ['[', '{']):
		# 	print('\tdoing jsondumps')
		# 	finalval=json.dumps(val, indent=2)