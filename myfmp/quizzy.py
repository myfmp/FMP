import psycopg2
from .encryptor import *

def Quizzy_Request():
    Data = []
    # Connection parameters
    params = {
        "dbname": "postgres",
        "user": "postgres.glaldxoenvpwwwbesqdv",
        "password": "tuM1EAO9FIOLvFqZ",
        "host": "aws-0-eu-west-3.pooler.supabase.com",
        "port": 6543
    }

    # Initialize conn and cur to None to avoid NameError in case of connection failure
    conn = None
    cur = None

    try:
        # Connect to the PostgreSQL server
        conn = psycopg2.connect(**params)
        print("Connection successful!")

        # Explicitly rollback to clear any previous transaction
        conn.rollback()

        # Create a cursor object
        cur = conn.cursor()

        # Execute the query to select id and title from quizzy_app_quizz
        cur.execute("SELECT * FROM quizzy_app_quizz")

        # Fetch all rows (which contain the IDs and titles)
        rows = cur.fetchall()

        # Check if rows were fetched
        if rows:
            print(f"Found {len(rows)} rows!")
            # Print each ID and title
            for row in rows:
                quiz_id = row[0]
                session = encrypt_data_2(str(quiz_id))
                quiz_title = row[2]
                Data.append([session,quiz_title])
                print(f"ID: {quiz_id}, Title: {quiz_title}")
        else:
            print("No rows found.")

        # Commit the transaction if all goes well
        conn.commit()

    except psycopg2.OperationalError as e:
        print(f"Operational error occurred: {e}")
        
    except psycopg2.DatabaseError as e:
        print(f"Database error occurred: {e}")
        if conn:
            conn.rollback()

    finally:
        # Close the cursor and connection only if they were successfully created
        if cur:
            cur.close()
        if conn:
            conn.close()

    return Data



