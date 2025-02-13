from dotenv import load_dotenv
import os

load_dotenv()
print(os.getenv("API_KEY"))
print(os.getenv("PORT"))

print("\nOR:\n")

from dotenv import dotenv_values

config = dotenv_values(".env")
print(config["API_KEY"])
print(config["PORT"])
