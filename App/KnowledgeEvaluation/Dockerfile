#https://docs.microsoft.com/en-us/azure/container-instances/container-instances-gpu
FROM tensorflow/tensorflow:devel-gpu
RUN apt-get update && \
    apt-get install -y build-essential \
                        apt-utils \
                        python-dev \
                        python3.8 \
                        python3-pip 

RUN apt-get upgrade -y
WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt
RUN pip install numpy --upgrade
EXPOSE 5000
CMD ["python", "app.py"]