import uuid
import os
from googleapiclient.http import MediaFileUpload
from .Google_api.Google import Create_Service
from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage
from .models import Files, Users, Subjects, Main_Courses

def Upload(File, File_name, Course_id, User_id):
    # Valid extensions and maximum file size in bytes
    valid_extensions = ['doc', 'docx', 'pdf', 'txt']
    max_file_size = 10 * 1024 * 1024  # 10 MB

    if Users.objects.filter(id=int(User_id)).exists():
        if Course_id == "0":
            file_extension = File.name.split('.')[-1]
            if file_extension not in valid_extensions:
                return False
            elif File.size > max_file_size:
                return False
            else:
                # Generate a unique filename using UUID
                unique_filename = f"{uuid.uuid4().hex}{File_name[File_name.rfind('.'):]}"

                folder_path = './myfmp/Google_api/cache/'
                file_path = default_storage.save(os.path.join(folder_path, unique_filename), File)

                # Upload the file to Google Drive directly
                file_id = upload_to_google_drive(file_path, unique_filename)
                
                # Construct and print the download link
                if file_id:
                    download_link = f"https://drive.google.com/uc?id={file_id}"
                    new_file = Files(id_publisher=int(User_id), file_path=download_link, id_subject="0", id_courses="0", file_name=File_name)
                    new_file.save()

                return True
        else:
            if Main_Courses.objects.filter(id=Course_id).exists():
                User = Users.objects.get(id=int(User_id))
                Course = Main_Courses.objects.get(id=Course_id)
                Subject = Subjects.objects.get(id=int(Course.subject))

                if User.year == Subject.school_year:
                    # Verify file extension
                    file_extension = File.name.split('.')[-1]
                    if file_extension not in valid_extensions:
                        return False
                    elif File.size > max_file_size:
                        return False
                    else:
                        # Generate a unique filename using UUID
                        unique_filename = f"{uuid.uuid4().hex}{File_name[File_name.rfind('.'):]}"

                        folder_path = './myfmp/Google_api/cache/'
                        file_path = default_storage.save(os.path.join(folder_path, unique_filename), File)

                        # Upload the file to Google Drive directly
                        file_id = upload_to_google_drive(file_path, unique_filename)
                        
                        # Construct and print the download link
                        if file_id:
                            download_link = f"https://drive.google.com/uc?id={file_id}"
                            new_file = Files(id_publisher=int(User_id), file_path=download_link, id_subject=Subject.id, id_courses=Course_id, file_name=File_name)
                            new_file.save()

                        return True

def upload_to_google_drive(file_path, file_name):
    CLIENT_SECRET_FILE = './myfmp/Google_api/Keys/credentials.json'
    API_NAME = 'drive'
    API_VERSION = 'v3'
    SCOPES = ['https://www.googleapis.com/auth/drive']
    service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)
    folder_id = '1-90tml_6FakrucZUJHUynN0-0fOABqlM'

    # Specify MIME types for each file
    mime_types = {
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }

    extension = os.path.splitext(file_name)[1].lower()

    # Set the MIME type based on the file extension
    mime_type = mime_types.get(extension, 'application/octet-stream')

    file_metadata = {
        'name': file_name,
        'parents': [folder_id]
    }

    media = MediaFileUpload(file_path, mime_type)

    # Upload file to Google Drive
    response = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id'
    ).execute()

    # Close the file explicitly after uploading
    media._fd.close()

    # Optionally, you can delete the local file after uploading
    os.remove(file_path)
    
    # Return the file ID
    return response.get('id', None)

