# Base Image
FROM python:3.6

# set default environment variables
ENV PYTHONUNBUFFERED 1
ENV LANG C.UTF-8
ENV DEBIAN_FRONTEND=noninteractive 

# set project environment variables
ENV PORT=8888
ENV DJANGO_SECRET_KEY=Qn1FaGtqcmcuTFVFSXVhP0RBdXk/WTBBXm1sdV5fIUFzJUNoW1F+Vn05PGgsUC1Ce2w=
ENV IN_DEPLOYMENT_ENV=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        tzdata \
        python3-setuptools \
        python3-pip \
        python3-dev \
        python3-venv \
        git \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


# install environment dependencies
RUN pip3 install --upgrade pip 
RUN pip3 install pipenv

# Install project dependencies
RUN pip3 install django==2.2.14
RUN pip3 install djangorestframework==3.11.0
RUN pip3 install djangorestframework-simplejwt
RUN pip3 install gunicorn==19.9.*

# create and set working directory
RUN mkdir /app
WORKDIR /app

# Add current directory code to working directory
ADD . /app/

EXPOSE 8888

ENTRYPOINT ["./docker-entrypoint.sh"]
