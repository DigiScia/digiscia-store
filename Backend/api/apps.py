from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        import api.signals

class PaymentsConfig(AppConfig):
    name = "payments"

    def ready(self):
        import payments.signals  # noqa

