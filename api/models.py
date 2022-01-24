from api import db
from sqlalchemy.sql import expression

class Schools(db.Model):
	page_id = db.Column(db.Integer, primary_key=True, default=300000)
	udise_id = db.Column(db.Integer, nullable=False, default=300000)

	title =db.Column(db.Text, nullable=False, default='')
	categories =db.Column(db.Text, nullable=False, default="[]")
	
	wordCount = db.Column(db.Integer, nullable=False, default=0)
	
	def __repr__(self):
		return f"School({self.page_id}/{self.udise_id} : {self.title} => {self.wordCount})\n"

'''
	default keys of the dictionary saved in "categories"

		['Title', 'Infobox', 'Location', 'Details', 'Academics', 'Counts', 
		'Ending', 'References', 'Facilities', 'Extracurricular', 'Admissions',
		'Faculty', 'History', 'Achievements', 'Order'] and more if added

		keyOf ={'a': 'Location', 'b': 'Details', 'c': 'Admissions', 'd': 'Academics',
					'e': 'Faculty', 'f': 'Counts', 'g': 'Achievements', 'h': 'Facilities',
					'i': 'Extracurricular', 'j': 'History', 'k': 'Ending', 'l': 'References'}
	
	figure out how to add 
'''

class Books(db.Model):
	book_id = db.Column(db.Integer, primary_key=True, default=0)

	title =db.Column(db.Text, nullable=False, default='')
	categories =db.Column(db.Text, nullable=False, default="{}")

	done =db.Column(db.Boolean, default=expression.false())
		
	def __repr__(self):
		return f"Book({self.book_id} : '{self.title}, categories={len(self.categories)}' )\n"

class Movies(db.Model):
	movie_id = db.Column(db.Integer, primary_key=True, default=0)

	title =db.Column(db.Text, nullable=False, default='')
	categories =db.Column(db.Text, nullable=False, default="{}")

	done =db.Column(db.Boolean, default=expression.false())
		
	def __repr__(self):
		return f"Movie({self.movie_id} : '{self.title}, categories={len(self.categories)}' )\n"

class Collections(db.Model):
	id = db.Column(db.Integer, primary_key=True)

	number =db.Column(db.Integer, default=0)
	domain =db.Column(db.Text, nullable=False, default="Books")
	startIndex =db.Column(db.Integer, nullable=False, default=0)
	length =db.Column(db.Integer, nullable=False, default=100)

	userName =db.Column(db.Text, nullable=False, default="")
	done =db.Column(db.Boolean, default=expression.false())
	#List of items ids
	itemsCompleted =db.Column(db.Text, default="[]")

	def __repr__(self) -> str:
		return f"Collection({self.id}: {self.domain}-{self.number}, user={self.userName}, done={self.done})\n"


def resetDB():
	db.drop_all()

def initDB():
	db.create_all()
	db.session.commit()


if __name__ == "__main__":
	# resetDB()
	# initDB()
	print('models.py main')


