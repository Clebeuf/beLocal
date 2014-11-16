from be_local_server.models import *
from datetime import *
from django.core.files import File 
import urllib

# MARKET ONE

# Create an address
a = Address(
	addr_line1="1330 Fairfield Road", # Street number and street name
	city="Victoria", # City
	state="BC", # Province
	country="Canada", # Country
	zipcode="V8S 5J1", # Postal Code
	latitude=48.414895, # Latitude
	longitude=-123.347773, #Longitude
)

# Save it
a.save()

# Create hours for the address
h1 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=4, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 8, 0, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 16, 0, 0), # (year, month, day, hour, minute, second)
)

# Save it
h1.save()

# Create hours for the address
h2 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=5, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime.now(), # (year, month, day, hour, minute, second)
	to_hour=datetime.now() # (year, month, day, hour, minute, second)
)

# Save it
h2.save()

result = urllib.urlretrieve('http://photos1.blogger.com/blogger/4131/3618/1600/DSCN0212.jpg') # image_url is a URL to an image

mp = MarketPhoto(
		image=File(open(result[0]))
)

mp.save()

# Create a market
m = Market(
	address=a, # Each Market object needs an address associated with it (this also associates hours)
	name="Moss Street Market", # Market name
	description="Moss Street Market is your local organic farmers' market. Celebrating its 23rd year, this vibrant community market features Victoria's largest selection of local and organic produce with over 25 farmers vending. Additionally, there are over 70 vendors offering handmade crafts, cards, clothing, jewelry, purses, toys, glass works, pottery, bath products, preserves, chocolates, baked goods, pesto, salsa, honey, and much much more. There is also a kids' activity tent and two acts of live music each week.", # Market description
	photo=mp
)

m.save()


# MARKET TWO

# Create an address
a = Address(
	addr_line1="1701 Douglas Street", # Street number and street name
	city="Victoria", # City
	state="BC", # Province
	country="Canada", # Country
	zipcode="V8W 0C1", # Postal Code
	latitude=48.429456,
	longitude=-123.36448,

)

# Save it
a.save()

# Create hours for the address
h1 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=3, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 8, 0, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 16, 0, 0), # (year, month, day, hour, minute, second)
)

# Save it
h1.save()

# Create hours for the address
h2 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=4, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 8, 0, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 16, 0, 0), # (year, month, day, hour, minute, second)
)

# Save it
h2.save()

result = urllib.urlretrieve('http://i3.stay.com/images/venue/486/9/6c2adaa6/granville-public-market.jpg') # image_url is a URL to an image

mp = MarketPhoto(
		image=File(open(result[0]))
)

mp.save()

# Create a market
m = Market(
	address=a, # Each Market object needs an address associated with it (this also associates hours)
	name="Hudson Public Market", # Market name
	description="Going back to the old-world style of shopping where you know your butcher, your baker, the person who grows your vegetables and the chickens that lay your eggs is what the Victoria Public Market at the Hudson is all about. The 18,000 square-foot Market is brimming with ingredients to match your kitchen and dining wish lists, meals made to order, picnics to go, a community kitchen featuring demonstrations by local chefs, a changing line-up of farmers and producers, plus a year-round farmers' market every Wednesday.", # Market description
	photo=mp
)

m.save()



# MARKET THREE

# Create an address
a = Address(
	addr_line1="Bastion Square", # Street number and street name
	city="Victoria", # City
	state="BC", # Province
	country="Canada", # Country
	zipcode="V5H1G9", # Postal Code
	latitude=48.4257621,
	longitude=-123.3684807,
)

# Save it
a.save()

# Create hours for the address
h1 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=1, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 8, 0, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 16, 0, 0), # (year, month, day, hour, minute, second)
)

# Save it
h1.save()

# Create hours for the address
h2 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=2, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 8, 0, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 16, 0, 0), # (year, month, day, hour, minute, second)
)

# Save it
h2.save()

# Create hours for the address
h3 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=3, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 8, 0, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 16, 0, 0), # (year, month, day, hour, minute, second)
)

# Save it
h3.save()

result = urllib.urlretrieve('http://3.bp.blogspot.com/-YJyZuPi8q00/Td2D3Eb3TSI/AAAAAAAAAN8/GnSU6r_jsQ8/s1600/DSC_0181.JPG') # image_url is a URL to an image

mp = MarketPhoto(
		image=File(open(result[0]))
)

mp.save()

# Create a market
m = Market(
	address=a, # Each Market object needs an address associated with it (this also associates hours)
	name="Bastion Square Market", # Market name
	description="The Bastion Square Public Market turns 19 this year! Stretching from Victoria's waterfront along Wharf Street to Government Street, this eclectic outdoor market brings liveliness to historic Bastion Square with its brilliant array of locally-produced arts, crafts, and entertainment.", # Market description
	photo=mp
)

m.save()



# MARKET FOUR

# Create an address
a = Address(
	addr_line1="494 Superior St Victoria", # Street number and street name
	city="Victoria", # City
	state="BC", # Province
	country="Canada", # Country
	zipcode="V8V 2G9", # Postal Code
	latitude=48.418221,
	longitude=-123.372516,
)

# Save it
a.save()

# Create hours for the address
h1 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=2, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 10, 0, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 16, 0, 0), # (year, month, day, hour, minute, second)
)

# Save it
h1.save()

# Create hours for the address
h2 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=3, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 10, 0, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 16, 0, 0), # (year, month, day, hour, minute, second)
)

# Save it
h2.save()

# Create hours for the address
h3 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=4, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 10, 0, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 16, 0, 0), # (year, month, day, hour, minute, second)
)

# Save it
h3.save()

result = urllib.urlretrieve('http://crdcommunitygreenmap.ca/sites/default/files/James%20Bay%20Market2.jpg') # image_url is a URL to an image

mp = MarketPhoto(
		image=File(open(result[0]))
)

mp.save()

# Create a market
m = Market(
	address=a, # Each Market object needs an address associated with it (this also associates hours)
	name="James Bay Market", # Market name
	description="You will be amazed at the variety of products available at the James Bay Market. Whether you're a local in need of some fresh red peppers, or a visitor looking for that unique something from Victoria, they've got it. Located two minutes from Victoria's Inner Harbour, the James Bay Community Market features produce, arts, food and live music with an emphasis on products that are homemade, handmade and homegrown.", # Market description
	photo=mp
)

m.save()