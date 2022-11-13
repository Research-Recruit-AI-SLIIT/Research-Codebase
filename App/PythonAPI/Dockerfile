FROM python:3.9.12-slim as build
ADD requirements.txt ./requirements.txt
RUN apt-get update && apt-get install -y build-essential && apt-get install -y wget
RUN apt-get install -y cmake
RUN pip install -U pip && pip install -r requirements.txt

#copy the files to the container
COPY . /app

WORKDIR /app

# FROM nvidia/cuda:9.0-base-ubuntu16.04
# COPY --from=build / /
# COPY --from=build /app/wsgi.py /wsgi.py

RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y

EXPOSE 5000

# CMD flask run -h 0.0.0.0 -p 5000
# CMD ["gunicorn", "-b", "0.0.0.0:5022", "app:app"]
ENTRYPOINT [ "python", "app.py" ]