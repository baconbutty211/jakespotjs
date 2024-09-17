import os
import psycopg2


class Database:
    _name = os.environ.get("POSTGRES_DATABASE")
    _user = os.environ.get("POSTGRES_USER")
    _password = os.environ.get("POSTGRES_PASSWORD")
    _host = os.environ.get("POSTGRES_HOST")

    def connect(self):
        connection = psycopg2.connect(
            dbname=self._name,
            user=self._user,
            password=self._password,
            host=self._host,
            port="5432",  # Default PostgreSQL port
        )
        cursor = self.connection.cursor()
        return connection, cursor

    def disconnect(self, connection, cursor):
        connection.close()
        cursor.close()
