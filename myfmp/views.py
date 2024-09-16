from django.shortcuts import render , HttpResponse , redirect
from django.http import JsonResponse, HttpResponse
import json
import requests
from .models import Pins, Users, Vrequests, Subjects, Main_Courses, Files, FMP
from .pymailer import Sendmail, Resendmail
from .uploader import Upload
from django.contrib.auth.hashers import make_password, check_password
from .authenticator import generate_tmp, authenticate, login
from .encryptor import  encrypt_data, decrypt_data
import ast  
from django.views.decorators.csrf import csrf_exempt
from .searcher import search_files
from .user_manager import change_password, change_username
from .file_manager import edit_file, delete_file
from .quizzy import *


def index(request):
    cookie_1 = 'id'
    # Check if the cookie exists
    if cookie_1 in request.COOKIES:
        # The cookie exists, get its value
        id= request.COOKIES[cookie_1]
        id_bytes = ast.literal_eval(id)
        decrypted_id = decrypt_data(id_bytes)
        if Users.objects.filter(id = decrypted_id).exists():
            return redirect('main')
    if request.method == 'POST':
        email = request.POST.get('mail')
        password = request.POST.get('password')
        if email and password:
            recaptcha_response = request.POST.get('g-recaptcha-response')
            recaptcha_secret_key = '6Lcs6TkpAAAAADAV3jLCeEMXt1EJgUE0NUhJolWt'  # Replace with your actual reCAPTCHA secret key
            recaptcha_verification_url = 'https://www.google.com/recaptcha/api/siteverify'
            recaptcha_data = {
                'secret': recaptcha_secret_key,
                'response': recaptcha_response
            }
            recaptcha_response_data = requests.post(recaptcha_verification_url, data=recaptcha_data)
            recaptcha_result = json.loads(recaptcha_response_data.text)

            if recaptcha_result['success']:
                # Retrieve the user based on email
                user = Users.objects.filter(mail=email).first()
                # Check if the user exists and the password matches
                if user and check_password(password, user.password):
                    response_data = {'success': 'User is verified'}
                    if user.verified:
                        response = JsonResponse(response_data)
                        cookie_id = encrypt_data(str(user.id))
                        response.set_cookie('id', cookie_id)
                        response.set_cookie('mail', email)
                        response.set_cookie('password', password)
                        return response
                    else:
                        return JsonResponse({'success2': 'User is not verified yet'})
                else:
                    return JsonResponse({'error': 'Invalid credentials'})
    return render(request, "index.html")


def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('mail')
        password = request.POST.get('password')
        recaptcha_response = request.POST.get('g-recaptcha-response')
        input_data = request.POST.get('input_data')
        if all(not v for v in [username, email, password]):
            pins = Pins.objects.values('pin')
            pin_values = [pin['pin'] for pin in pins]
            if input_data in pin_values:
                return JsonResponse({'sucess': 'Data received successfully. Input matches a pin.'})
            else:
                return JsonResponse({'error': 'Input does not match any pin.'})
        else:
            # Verify reCAPTCHA v3
            recaptcha_secret_key = '6Lcs6TkpAAAAADAV3jLCeEMXt1EJgUE0NUhJolWt'  # Replace with your actual reCAPTCHA secret key
            recaptcha_verification_url = 'https://www.google.com/recaptcha/api/siteverify'

            recaptcha_data = {
                'secret': recaptcha_secret_key,
                'response': recaptcha_response
            }

            recaptcha_response_data = requests.post(recaptcha_verification_url, data=recaptcha_data)
            recaptcha_result = json.loads(recaptcha_response_data.text)

            input_data = request.POST.get('input_data')
            pins = Pins.objects.values('pin')
            pin_values = [pin['pin'] for pin in pins]

            if recaptcha_result['success'] and input_data in pin_values:
                if Users.objects.filter(mail=email).exists():
                    return JsonResponse({'success3': 'Email existing'})
                else:
                    hashed_password = make_password(password)
                    new_user = Users(username=username, mail=email, password=hashed_password)
                    new_user.save()
                    tmp = generate_tmp(10)
                    new_auth = Vrequests(mail=email, tmp=tmp)
                    new_auth.save()
                    html = """\
                        <html xmlns="http://www.w3.org/1999/xhtml">

                        <head>
                        <meta http-equiv="content-type" content="text/html; charset=utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0;">
                        <meta name="format-detection" content="telephone=no" />

                        <style>
                        /* Reset styles */
                        body {
                            margin: 0;
                            padding: 0;
                            min-width: 100%;
                            width: 100% !important;
                            height: 100% !important;
                        }

                        body,
                        table,
                        td,
                        div,
                        p,
                        a {
                            -webkit-font-smoothing: antialiased;
                            text-size-adjust: 100%;
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                            line-height: 100%;
                        }

                        table,
                        td {
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse !important;
                            border-spacing: 0;
                        }

                        img {
                            border: 0;
                            line-height: 100%;
                            outline: none;
                            text-decoration: none;
                            -ms-interpolation-mode: bicubic;
                        }

                        #outlook a {
                            padding: 0;
                        }

                        .ReadMsgBody {
                            width: 100%;
                        }

                        .ExternalClass {
                            width: 100%;
                        }

                        .ExternalClass,
                        .ExternalClass p,
                        .ExternalClass span,
                        .ExternalClass font,
                        .ExternalClass td,
                        .ExternalClass div {
                            line-height: 100%;
                        }

                        @media all and (min-width: 560px) {
                            body {
                            margin-top: 30px;
                            }
                        }

                        /* Rounded corners */
                        @media all and (min-width: 560px) {
                            .container {
                            border-radius: 8px;
                            -webkit-border-radius: 8px;
                            -moz-border-radius: 8px;
                            -khtml-border-radius: 8px;
                            }
                        }
                        /* Links */
                        a,
                        a:hover {
                            color: #127DB3;
                        }

                        .footer a,
                        .footer a:hover {
                            color: #999999;
                        }
                        </style>

                        <!-- MESSAGE SUBJECT -->
                        <title>Confirm email</title>

                        </head>

                        <!-- BODY -->
                        <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0;  padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
                        background-color: #F0F0F0;
                        color: #000000;" bgcolor="#F0F0F0" text="#000000">
                        <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background">
                        <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;" bgcolor="#F0F0F0">
                            <table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#FFFFFF" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                        max-width: 560px;" class="container">
                                <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
                                padding-top: 25px;
                                color: #000000;
                                font-family: sans-serif;" class="header">
                                    <img border="0" src="https://i.postimg.cc/Kz68XC0h/Logo-no-bg.png" vspace="0" hspace="0" src="" width="200" alt="FMP" title="FMP" />
                                </td>
                                </tr>
                                <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                padding-top: 25px;" class="line">
                                    <hr color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
                                </td>
                                </tr>
                                <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                                padding-top: 25px; 
                                color: #000000;
                                font-family: sans-serif;" class="paragraph">
                                    Hi """ + username + """,<br> In order to start using your new account, you need to confirm your email address.
                                </td>
                                </tr>
                                <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                padding-top: 25px;
                                padding-bottom: 5px;" class="button">
                                    <a style="text-decoration: underline;">
                                    <table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;">
                                        <tr>
                                        <td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
                                            bgcolor="#3A6DF0"><a target="_blank" style="text-decoration: underline;
                                        color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;" href='https://myfmp.vercel.app/authenticator?tmp="""+tmp+"""'>
                                            Verify Email Address
                                        </a>
                                        </td>
                                        </tr>
                                    </table>
                                    </a>
                                </td>
                                </tr>
                                <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                padding-top: 25px;" class="line">
                                    <hr color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
                                </td>
                                </tr>
                                <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                                padding-top: 20px;
                                padding-bottom: 25px;
                                color: #000000;
                                font-family: sans-serif;" class="paragraph">
                                    If you did not sign up for this account you can ignore this email and the account will be deleted.
                                </td>
                                </tr>
                            </table>
                            <table border="0" cellpadding="0" cellspacing="0" align="center" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                        max-width: 560px;" class="wrapper">
                                <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;
                                padding-top: 20px;
                                padding-bottom: 20px;
                                color: #999999;
                                font-family: sans-serif;" class="footer">
                                    This is an automated email; replies are not monitored
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        </table>
                        </body>
                        </html>
                    """
                    Sendmail(email, "E-mail verification", html)
                    return JsonResponse({'success2': 'Form submitted successfully'})
            else:
                return JsonResponse({'error': 'reCAPTCHA verification failed'})
    else:
        return render(request, "register.html")


def authenticator(request):
    tmp = request.GET.get('tmp')
    Fmps = FMP.objects.all()
    Fmp_data = [[Fmp.name, Fmp.description] for Fmp in Fmps]
    allowed_values_1 = [ Fmp_name.name for Fmp_name in Fmps]
    if request.method == 'POST':
        tmp = request.POST.get('tmp')
        uni = request.POST.get('uni')
        year = request.POST.get('year')
        allowed_values_2 = ['1', '2', '3', '4', '5', '6']
        print(allowed_values_1)
        if uni in allowed_values_1 and year in allowed_values_2:
          authenticate(tmp, uni, year)
          return JsonResponse({'success': 'authenticated'})
        else:
          return render(request, "authenticator.html", {'FMPs': Fmp_data})
    else:
        if Vrequests.objects.filter(tmp=tmp).exists():
            return render(request, "authenticator.html", {'FMPs': Fmp_data})
        else:
            return redirect('index')

def back_up(request):
    rec_mail = request.GET.get('mail')
    if rec_mail:
        if Users.objects.filter(mail=rec_mail , verified=True).exists():
            if Vrequests.objects.filter(mail=rec_mail).exists():
                url = f"mailer?mail={rec_mail}"
                return render(request, "redirect.html", {'target': url})
            else:
                tmp = generate_tmp(10)
                hashed_tmp = make_password(tmp)
                new_auth = Vrequests(mail=rec_mail, tmp=hashed_tmp)
                new_auth.save()
                html = """\
                    <html xmlns="http://www.w3.org/1999/xhtml">

                    <head>
                    <meta http-equiv="content-type" content="text/html; charset=utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0;">
                    <meta name="format-detection" content="telephone=no" />

                    <style>
                    /* Reset styles */
                    body {
                        margin: 0;
                        padding: 0;
                        min-width: 100%;
                        width: 100% !important;
                        height: 100% !important;
                    }

                    body,
                    table,
                    td,
                    div,
                    p,
                    a {
                        -webkit-font-smoothing: antialiased;
                        text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                        -webkit-text-size-adjust: 100%;
                        line-height: 100%;
                    }

                    table,
                    td {
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: collapse !important;
                        border-spacing: 0;
                    }

                    img {
                        border: 0;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                        -ms-interpolation-mode: bicubic;
                    }

                    #outlook a {
                        padding: 0;
                    }

                    .ReadMsgBody {
                        width: 100%;
                    }

                    .ExternalClass {
                        width: 100%;
                    }

                    .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                        line-height: 100%;
                    }

                    @media all and (min-width: 560px) {
                        body {
                        margin-top: 30px;
                        }
                    }

                    /* Rounded corners */
                    @media all and (min-width: 560px) {
                        .container {
                        border-radius: 8px;
                        -webkit-border-radius: 8px;
                        -moz-border-radius: 8px;
                        -khtml-border-radius: 8px;
                        }
                    }
                    /* Links */
                    a,
                    a:hover {
                        color: #127DB3;
                    }

                    .footer a,
                    .footer a:hover {
                        color: #999999;
                    }
                    </style>

                    <!-- MESSAGE SUBJECT -->
                    <title>Confirm email</title>

                    </head>

                    <!-- BODY -->
                    <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0;  padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
                    background-color: #F0F0F0;
                    color: #000000;" bgcolor="#F0F0F0" text="#000000">
                    <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background">
                    <tr>
                        <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;" bgcolor="#F0F0F0">
                        <table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#FFFFFF" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                    max-width: 560px;" class="container">
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
                            padding-top: 25px;
                            color: #000000;
                            font-family: sans-serif;" class="header">
                                <img border="0" src="https://i.postimg.cc/Kz68XC0h/Logo-no-bg.png" vspace="0" hspace="0" src="" width="200" alt="FMP" title="FMP" />
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                            padding-top: 25px;" class="line">
                                <hr color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                            padding-top: 25px; 
                            color: #000000;
                            font-family: sans-serif;" class="paragraph">

                              Hello there! 🌟 We noticed you might need to set up a new password. No worries, we've got you covered! 🛡️ Click on the link below to concoct a new, strong password that's as secure as a vault. 🍔🥤 And hey, why did the milkshake bring a ladder to the bar? Because it wanted to reach the higher shakes! 😄 Enjoy securing your account!

                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                            padding-top: 25px;
                            padding-bottom: 5px;" class="button">
                                <a style="text-decoration: underline;">
                                <table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;">
                                    <tr>
                                    <td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
                                        bgcolor="#3A6DF0"><a target="_blank" style="text-decoration: underline;
                                    color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;" href='https://myfmp.vercel.app/recovery?tmp="""+tmp+"""&mail="""+rec_mail+"""'>
                                        Change password 
                                    </a>
                                    </td>
                                    </tr>
                                </table>
                                </a>
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                            padding-top: 25px;" class="line">
                                <hr color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                            padding-top: 20px;
                            padding-bottom: 25px;
                            color: #000000;
                            font-family: sans-serif;" class="paragraph">
                                If you did not sign up for this account you can ignore this email and the account will be deleted.
                            </td>
                            </tr>
                        </table>
                        <table border="0" cellpadding="0" cellspacing="0" align="center" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                    max-width: 560px;" class="wrapper">
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;
                            padding-top: 20px;
                            padding-bottom: 20px;
                            color: #999999;
                            font-family: sans-serif;" class="footer">
                                This is an automated email; replies are not monitored
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </table>
                    </body>
                    </html>
                """
                Sendmail(rec_mail, "Change password", html)
                url = f"mailer?mail={rec_mail}"
                return render(request, "redirect.html", {'target': url})
        else:
            return redirect(index)
    else:
        return redirect(index)
    

def recovery(request):
    tmp = request.GET.get('tmp')
    mail = request.GET.get('mail')
    if request.method == 'POST':   
        new_psw = request.POST.get('password')
        if new_psw:
            if tmp and mail:
                recaptcha_response = request.POST.get('g-recaptcha-response')
                recaptcha_secret_key = '6Lcs6TkpAAAAADAV3jLCeEMXt1EJgUE0NUhJolWt'  # Replace with your actual reCAPTCHA secret key
                recaptcha_verification_url = 'https://www.google.com/recaptcha/api/siteverify'
                recaptcha_data = {
                    'secret': recaptcha_secret_key,
                    'response': recaptcha_response
                }
                recaptcha_response_data = requests.post(recaptcha_verification_url, data=recaptcha_data)
                recaptcha_result = json.loads(recaptcha_response_data.text)
                if recaptcha_result['success']:
                    if Users.objects.filter(mail=mail , verified=True).exists():
                        if Vrequests.objects.filter(mail=mail).exists():
                            Request = Vrequests.objects.get(mail=mail)
                            if check_password(tmp, Request.tmp):
                                change_password(new_psw, mail)
                                return JsonResponse({'success': 'Data received successfully.'})
                            else:
                                redirect('index')
                        else:
                            redirect('index')
                    else:
                        redirect('index')
            else:
                redirect('index')
    return render(request, "recovery.html")


def mailer(request):
    if request.method == 'POST':
        verf_mail = request.POST.get('resend_mail')
        if verf_mail:
            if Users.objects.filter(mail=verf_mail , verified=False).exists():
                last_request = Vrequests.objects.get(mail=verf_mail)
                html = """\
                    <html xmlns="http://www.w3.org/1999/xhtml">

                    <head>
                    <meta http-equiv="content-type" content="text/html; charset=utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0;">
                    <meta name="format-detection" content="telephone=no" />

                    <style>
                    /* Reset styles */
                    body {
                        margin: 0;
                        padding: 0;
                        min-width: 100%;
                        width: 100% !important;
                        height: 100% !important;
                    }

                    body,
                    table,
                    td,
                    div,
                    p,
                    a {
                        -webkit-font-smoothing: antialiased;
                        text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                        -webkit-text-size-adjust: 100%;
                        line-height: 100%;
                    }

                    table,
                    td {
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: collapse !important;
                        border-spacing: 0;
                    }

                    img {
                        border: 0;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                        -ms-interpolation-mode: bicubic;
                    }

                    #outlook a {
                        padding: 0;
                    }

                    .ReadMsgBody {
                        width: 100%;
                    }

                    .ExternalClass {
                        width: 100%;
                    }

                    .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                        line-height: 100%;
                    }

                    @media all and (min-width: 560px) {
                        body {
                        margin-top: 30px;
                        }
                    }

                    /* Rounded corners */
                    @media all and (min-width: 560px) {
                        .container {
                        border-radius: 8px;
                        -webkit-border-radius: 8px;
                        -moz-border-radius: 8px;
                        -khtml-border-radius: 8px;
                        }
                    }
                    /* Links */
                    a,
                    a:hover {
                        color: #127DB3;
                    }

                    .footer a,
                    .footer a:hover {
                        color: #999999;
                    }
                    </style>

                    <!-- MESSAGE SUBJECT -->
                    <title>Confirm email</title>

                    </head>

                    <!-- BODY -->
                    <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0;  padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
                    background-color: #F0F0F0;
                    color: #000000;" bgcolor="#F0F0F0" text="#000000">
                    <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background">
                    <tr>
                        <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;" bgcolor="#F0F0F0">
                        <table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#FFFFFF" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                    max-width: 560px;" class="container">
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
                            padding-top: 25px;
                            color: #000000;
                            font-family: sans-serif;" class="header">
                                <img border="0" src="https://i.postimg.cc/Kz68XC0h/Logo-no-bg.png" vspace="0" hspace="0" src="" width="200" alt="FMP" title="FMP" />
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                            padding-top: 25px;" class="line">
                                <hr color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                            padding-top: 25px; 
                            color: #000000;
                            font-family: sans-serif;" class="paragraph">
                                Hi again,<br> In order to start using your new account, you need to confirm your email address.
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                            padding-top: 25px;
                            padding-bottom: 5px;" class="button">
                                <a style="text-decoration: underline;">
                                <table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;">
                                    <tr>
                                    <td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
                                        bgcolor="#3A6DF0"><a target="_blank" style="text-decoration: underline;
                                    color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;" href='https://myfmp.vercel.app/authenticator?tmp="""+last_request.tmp+"""'>
                                        Verify Email Address
                                    </a>
                                    </td>
                                    </tr>
                                </table>
                                </a>
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                            padding-top: 25px;" class="line">
                                <hr color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                            padding-top: 20px;
                            padding-bottom: 25px;
                            color: #000000;
                            font-family: sans-serif;" class="paragraph">
                                If you did not sign up for this account you can ignore this email and the account will be deleted.
                            </td>
                            </tr>
                        </table>
                        <table border="0" cellpadding="0" cellspacing="0" align="center" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                    max-width: 560px;" class="wrapper">
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;
                            padding-top: 20px;
                            padding-bottom: 20px;
                            color: #999999;
                            font-family: sans-serif;" class="footer">
                                This is an automated email; replies are not monitored
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </table>
                    </body>
                    </html>
                """
                Resendmail(verf_mail, "E-mail verification", html)
            elif Users.objects.filter(mail=verf_mail , verified=True).exists() and Vrequests.objects.filter(mail=verf_mail).exists():
                new_tmp = generate_tmp(10)
                new_hashed_tmp = make_password(new_tmp)
                last_request = Vrequests.objects.get(mail=verf_mail)
                last_request.tmp = new_hashed_tmp
                last_request.save()
                html = """\
                    <html xmlns="http://www.w3.org/1999/xhtml">

                    <head>
                    <meta http-equiv="content-type" content="text/html; charset=utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0;">
                    <meta name="format-detection" content="telephone=no" />

                    <style>
                    /* Reset styles */
                    body {
                        margin: 0;
                        padding: 0;
                        min-width: 100%;
                        width: 100% !important;
                        height: 100% !important;
                    }

                    body,
                    table,
                    td,
                    div,
                    p,
                    a {
                        -webkit-font-smoothing: antialiased;
                        text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                        -webkit-text-size-adjust: 100%;
                        line-height: 100%;
                    }

                    table,
                    td {
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: collapse !important;
                        border-spacing: 0;
                    }

                    img {
                        border: 0;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                        -ms-interpolation-mode: bicubic;
                    }

                    #outlook a {
                        padding: 0;
                    }

                    .ReadMsgBody {
                        width: 100%;
                    }

                    .ExternalClass {
                        width: 100%;
                    }

                    .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                        line-height: 100%;
                    }

                    @media all and (min-width: 560px) {
                        body {
                        margin-top: 30px;
                        }
                    }

                    /* Rounded corners */
                    @media all and (min-width: 560px) {
                        .container {
                        border-radius: 8px;
                        -webkit-border-radius: 8px;
                        -moz-border-radius: 8px;
                        -khtml-border-radius: 8px;
                        }
                    }
                    /* Links */
                    a,
                    a:hover {
                        color: #127DB3;
                    }

                    .footer a,
                    .footer a:hover {
                        color: #999999;
                    }
                    </style>

                    <!-- MESSAGE SUBJECT -->
                    <title>Confirm email</title>

                    </head>

                    <!-- BODY -->
                    <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0;  padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
                    background-color: #F0F0F0;
                    color: #000000;" bgcolor="#F0F0F0" text="#000000">
                    <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background">
                    <tr>
                        <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;" bgcolor="#F0F0F0">
                        <table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#FFFFFF" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                    max-width: 560px;" class="container">
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
                            padding-top: 25px;
                            color: #000000;
                            font-family: sans-serif;" class="header">
                                <img border="0" src="https://i.postimg.cc/Kz68XC0h/Logo-no-bg.png" vspace="0" hspace="0" src="" width="200" alt="FMP" title="FMP" />
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                            padding-top: 25px;" class="line">
                                <hr color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                            padding-top: 25px; 
                            color: #000000;
                            font-family: sans-serif;" class="paragraph">

                              Hello there! 🌟 We noticed you might need to set up a new password. No worries, we've got you covered! 🛡️ Click on the link below to concoct a new, strong password that's as secure as a vault. 🍔🥤 And hey, why did the milkshake bring a ladder to the bar? Because it wanted to reach the higher shakes! 😄 Enjoy securing your account!

                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                            padding-top: 25px;
                            padding-bottom: 5px;" class="button">
                                <a style="text-decoration: underline;">
                                <table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;">
                                    <tr>
                                    <td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
                                        bgcolor="#3A6DF0"><a target="_blank" style="text-decoration: underline;
                                    color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;" href='https://myfmp.vercel.app/recovery?tmp="""+new_tmp+"""&mail="""+verf_mail+"""'>
                                        Change password 
                                    </a>
                                    </td>
                                    </tr>
                                </table>
                                </a>
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                            padding-top: 25px;" class="line">
                                <hr color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
                            </td>
                            </tr>
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                            padding-top: 20px;
                            padding-bottom: 25px;
                            color: #000000;
                            font-family: sans-serif;" class="paragraph">
                                If you did not sign up for this account you can ignore this email and the account will be deleted.
                            </td>
                            </tr>
                        </table>
                        <table border="0" cellpadding="0" cellspacing="0" align="center" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                    max-width: 560px;" class="wrapper">
                            <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;
                            padding-top: 20px;
                            padding-bottom: 20px;
                            color: #999999;
                            font-family: sans-serif;" class="footer">
                                This is an automated email; replies are not monitored
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </table>
                    </body>
                    </html>
                """
                Resendmail(verf_mail, "Change password", html)
    return render(request, "mailer.html")

def logout(request):
    # Replace 'your_cookie_name' with the name of the cookie you want to delete
    cookie_name = 'id'
    # Check if the cookie exists before trying to delete it
    if cookie_name in request.COOKIES:
        response = redirect('index')
        response.delete_cookie(cookie_name)
        return response
    else:
        return redirect('index')

@csrf_exempt
def main(request):
    cookie_1 = 'id'
    cookie_2 = 'mail'
    cookie_3 = 'password'
    # Check if the cookie exists
    if cookie_1 in request.COOKIES:
        # The cookie exists, get its value
        id= request.COOKIES[cookie_1]
        cmail = request.COOKIES[cookie_2]
        cpassword = request.COOKIES[cookie_3]
        id_bytes = ast.literal_eval(id)
        decrypted_id = decrypt_data(id_bytes)
        if login(cmail, cpassword) and Users.objects.filter(id=decrypted_id, verified=True).exists():
            # Retrieve the subject by its id
            Load_User = Users.objects.get(id=decrypted_id)
            user_shcool_year = Load_User.year
            if request.method == 'POST':
                post_semester = request.POST.get('semester')
                post_subject = request.POST.get('subject')
                file = request.FILES.get('file')
                course = request.POST.get('course_id')
                title = request.POST.get('title')
                Get_Subjects_By_Semester = request.POST.get('session_fetch')
                Get_Courses_By_Subjects = request.POST.get('courses_fetch')
                Get_Files_By_Courses = request.POST.get('files_fetch')
                Get_User_Search_Query = request.POST.get('search_query')
                new_username = request.POST.get('new_username')
                new_file_name = request.POST.get('new_file_name')
                newly_named_file_id = request.POST.get('file_id_edit')
                file_to_delete = request.POST.get('file_to_delete_id')
                if file_to_delete:
                    delete_file(file_to_delete)
                    return JsonResponse({'success': 'file deleted'}) 
                if new_file_name and newly_named_file_id:
                    edit_file(newly_named_file_id, new_file_name)
                    return JsonResponse({'success': 'file name changed'}) 
                if new_username:
                    change_username(new_username, decrypted_id)
                    return JsonResponse({'success': 'username changed'}) 
                if Get_User_Search_Query:
                    user_search_results = search_files(Get_User_Search_Query)
                    return JsonResponse({'search_results': user_search_results})
                if Get_Files_By_Courses:
                    if Files.objects.filter(id_courses=Get_Files_By_Courses).exists():
                        files2 = Files.objects.filter(id_courses=Get_Files_By_Courses)
                        file_data_2 = [[file2.id, file2.file_name, file2.file_path] for file2 in files2]
                        return JsonResponse({'file_data_2': file_data_2})
                    else:
                        return JsonResponse({'file_not_available': 'file not available'})
                if Get_Courses_By_Subjects:
                    if Main_Courses.objects.filter(subject=Get_Courses_By_Subjects).exists():
                        courses2 = Main_Courses.objects.filter(subject=Get_Courses_By_Subjects)
                        course_data_2 = [[course2.id, course2.name] for course2 in courses2]
                        return JsonResponse({'course_data_2': course_data_2})
                    else:
                        return JsonResponse({'course_not_available': 'Course not available'})                    
                if Get_Subjects_By_Semester:
                    if Subjects.objects.filter(semester=Get_Subjects_By_Semester).exists():
                        subjects2 = Subjects.objects.filter(semester=Get_Subjects_By_Semester)
                        subjects_data_2 = [[subject2.id, subject2.subject, subject2.semester] for subject2 in subjects2]
                        return JsonResponse({'subjects_2': subjects_data_2})
                    else:
                        return JsonResponse({'subject_not_available': 'Subject not available'})
                if file and course and title:
                    File_Uploaded = Upload(file, title, course,decrypted_id)
                    if File_Uploaded:
                     return JsonResponse({'success': 'File uploaded successfully!'})
                    else:
                     return JsonResponse({'error': 'Failed to upload'})
                if post_semester and post_subject:
                    if Subjects.objects.filter(school_year=user_shcool_year, semester=post_semester).exists():
                        if Main_Courses.objects.filter(subject = post_subject).exists():
                            courses = Main_Courses.objects.filter(subject = post_subject)
                            courses_data = [[course.id, course.name] for course in courses]
                            return JsonResponse({'courses': courses_data})
                        else: 
                            return JsonResponse({'courses_not_available': 'courses not available'})
                    else:
                        return JsonResponse({'Error': 'User issue'})
                elif post_semester:
                    if Subjects.objects.filter(school_year=user_shcool_year, semester=post_semester).exists():
                        subjects = Subjects.objects.filter(school_year=user_shcool_year, semester=post_semester)
                        subjects_data = [[subject.id, subject.subject, subject.semester] for subject in subjects]
                        return JsonResponse({'subjects': subjects_data})
                    else:
                        return JsonResponse({'subject_not_available': 'Subject not available'})
            Get_User_Files = Files.objects.filter(id_publisher=decrypted_id)
            User_File_Data = []
            # Loop through the matching rows and print their values
            for User_Files in Get_User_Files:
                if User_Files.id_subject == "0":
                    User_File_Data.append([User_Files.id, User_Files.file_path, User_Files.file_name, "other"])
                else:
                    Get_related_Subject = Subjects.objects.get(id=int(User_Files.id_subject))
                    User_File_Data.append([User_Files.id, User_Files.file_path, User_Files.file_name, Get_related_Subject.subject])
            Quizs_Data = Quizzy_Request()
            return render(request, 'main.html', {'year': user_shcool_year, 'User_File_Data_Tmp': User_File_Data, 'username': Load_User.username, 'mail': Load_User.mail, 'Quizs':Quizs_Data})
        else:
            return redirect('logout')
    else:
        return redirect('index')
    
