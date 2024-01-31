from fuzzywuzzy import fuzz
from .models import Subjects, Files

def search_files(user_query, min_score=50):
    all_files = Files.objects.all()
    all_query = []

    for file_instance in all_files:
        if file_instance.id_subject == "0":
            file_subject = "other"
        else:
            get_file_subject = Subjects.objects.get(id=int(file_instance.id_subject))
            file_subject = get_file_subject.subject

        # Append file details to all_query
        all_query.append([file_instance.id, file_instance.file_name, file_instance.file_path, file_subject])

    matching_files = []

    for file_details in all_query:
        file_name = file_details[1]
        similarity_score = fuzz.token_sort_ratio(user_query.lower(), file_name.lower())
        
        if similarity_score >= min_score:
            matching_files.append(file_details + [similarity_score])

    # Sort the results by similarity score in descending order
    matching_files.sort(key=lambda x: x[-1], reverse=True)

    return matching_files


 