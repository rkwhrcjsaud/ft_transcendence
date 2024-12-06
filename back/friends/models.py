from django.db import models
from django.contrib.auth.models import User

class Friend(models.Model):
    user = models.ForeignKey(User, related_name="friends", on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name="friend_of", on_delete=models.CASCADE)
    create_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'friend')