"""
URL configuration for transcendence project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
import sys
import os
from vault import *

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from manage import getSecretValue

urlpatterns = [
    path(getSecretValue('back/BACK_API_USER'), admin.site.urls),
    path(getSecretValue('back/BACK_API_ACCOUNT'), include('accounts.urls')),
    path(getSecretValue('back/BACK_API_SOCIAL_ACCOUNTS'), include('social_accounts.urls')),
    path(getSecretValue('back/BACK_API_FRIENDS'), include('friends.urls')),
]
