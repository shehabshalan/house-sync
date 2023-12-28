from datetime import timedelta

from app.models import TaskFrequency


def generate_due_dates(start_date, frequency, num_users):
    due_dates = []
    for i in range(num_users):
        due_date = (
            start_date + timedelta(weeks=i)
            if frequency == TaskFrequency.WEEKLY
            else start_date + timedelta(weeks=i * 4)
        )  # otherwise it is monthly
        due_dates.append(due_date)
    return due_dates
