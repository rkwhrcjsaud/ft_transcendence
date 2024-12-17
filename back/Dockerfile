FROM python

RUN apt update && apt install -y --no-install-recommends \
    postgresql-client \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./entry.sh /usr/local/bin/entry.sh
RUN chmod +x /usr/local/bin/entry.sh
COPY . .

EXPOSE 8000
ENTRYPOINT ["/usr/local/bin/entry.sh"]

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]