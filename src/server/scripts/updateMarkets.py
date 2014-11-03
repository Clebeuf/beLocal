from be_local_server.models import *
from datetime import *

# MARKET ONE

# Create an address
a = Address(
	addr_line1="1129 Verdier Avenue", # Street number and street name
	city="Victoria", # City
	state="British Columbia", # Province
	country="Canada", # Country
	zipcode="V8M2H1" # Postal Code
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
	weekday=6, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime.now(), # (year, month, day, hour, minute, second)
	to_hour=datetime.now() # (year, month, day, hour, minute, second)
)

# Save it
h2.save()

# Create a market
m = Market(
	address=a, # Each Market object needs an address associated with it (this also associates hours)
	name="Market", # Market name
	description="Market description", # Market description
)

# Save it
m.save()