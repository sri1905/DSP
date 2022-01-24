import gc, re, json
import pandas as pd
from api import db, pickleFolder
from api.models import Collections, Books

def updateBooksCompleted():
	for collection in Collections.query.filter_by(domain="book").all():		
		books =Books.query.all()[collection.startIndex:collection.startIndex+collection.length]
		
		doneBooks =[book.book_id for book in books if book.done]
		print('collection',collection.number, ':', len(doneBooks))
		collection.itemsCompleted =json.dumps(doneBooks)

	db.session.commit()

def updateDomains():
	for collection in Collections.query.all():
		if collection.domain=='Books':
			collection.domain='book'
		elif collection.domain=='Movies':
			collection.domain='movie'
		
	db.session.commit()

# Functions to dowload a particular domain (generate dataframe and then csv)
def getColumns(languages, Domain):
	item =Domain.query.first()
	categories =json.loads(item.categories).keys()
	return [l+' '+c for c in categories for l in languages]

def downloadBooks():
	df =pd.DataFrame(columns=getColumns(['EN', 'TE'], Books))
	
	books =Books.query.all()[:50]
	for book in books:
		# Uncomment below "if" if you want all books
		if not book.done:
			print(book.book_id, 'not done')
			continue
		
		categories =json.loads(book.categories)
		
		row =[]
		for _,value in categories.items():
			# print(re.sub(r',?[\r\n]', '; ', value[0].strip()))
			row.append(re.sub(r',?[\r\n]', '; ', value[0].strip()))
			row.append(re.sub(r',?[\r\n]', '; ', value[1].strip()))

		rowSeries=pd.Series(row, index=df.columns)
		df=df.append(rowSeries, ignore_index=True)

	
	df.to_csv('books_testing.csv', index=False, encoding='utf-8', sep='\t')

	del(df)
	gc.collect()

if __name__=='__main__':
	# updateBooksCompleted()
	# updateDomains()
	# print('change the file if you want to update anything.')

	downloadBooks()
