# Granular Data Access - Database Comparison

## Introduction
This document compares databases for controlling access to data, including who can read, write, or see different parts of the data.

Databases considered:
- PostgreSQL
- MySQL
- MongoDB
- SQLite

## What We Looked At
- How detailed the access control is
- How well the database handles growth and more users
- Performance and speed
- Community support and resources

## Database Comparison

### PostgreSQL
**Pros:**
- Very detailed control over who can see or change each piece of data (Row-Level Security)
- Works well with complex queries and large amounts of data
- Reliable for busy applications
- Lots of help and documentation available

**Cons:**
- More complicated to set up and manage
- Can be a bit slower for read-heavy tasks

**Why Use It:**  
Best choice for strict data access control, allowing:
- Data that **cannot be read**
- Data that **can only be read**
- Data that **can be read and written**

### MySQL
**Pros:**
- Fast for reading data
- Very popular and well-documented

**Cons:**
- Cannot control access as precisely as PostgreSQL
- Harder to grow with complex needs

**Why Not Use It:**  
Lacks the detailed control needed for this assignment.

### MongoDB
**Pros:**
- Flexible way to store data
- Good for scaling up with lots of users

**Cons:**
- Less detailed control over who can see or change data
- Not as good for complex data queries

**Why Not Use It:**  
Access control is not detailed enough for strict permission needs.

### SQLite
**Pros:**
- Easy to set up and use
- Fast for small tasks

**Cons:**
- No advanced control over data access
- Not good for large or high-traffic applications

**Why Not Use It:**  
Too simple and lacks the access control needed.

## Conclusion
**PostgreSQL** is the best choice because it allows very detailed control over who can see or change each piece of data. **MySQL** is fast but doesn’t have enough control features. **MongoDB** is flexible but not strict enough with data access. **SQLite** is too basic for this purpose.