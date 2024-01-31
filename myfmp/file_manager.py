from .models import Files
from .Google_api.Google import Create_Service
from urllib.parse import urlparse, parse_qs


def edit_file(id, name):
    new_flname = Files.objects.get(id=id)
    new_flname.file_name = name
    new_flname.save()

def delete_file(id):
    file_to_delete = Files.objects.get(id=id)
    parsed_url = urlparse(file_to_delete.file_path)
    query_params = parse_qs(parsed_url.query)
    file_id = query_params['id'][0]
    CLIENT_SECRET_FILE = './myfmp/Google_api/Keys/credentials.json'
    API_NAME = 'drive'
    API_VERSION = 'v3'
    SCOPES = ['https://www.googleapis.com/auth/drive']
    service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)
    service.files().delete(fileId=file_id).execute()
    file_to_delete.delete()