# How to install
First I will assume you already have git and docker installed.

Installation steps:
```
git clone https://github.com/aleksaa01/CalendarWebApp.git
cd CalendarWebApp/CalendarWebApp
docker build -t calendar-web-app -f Dockerfile .
docker run -it --name app -p 80:8888 calendar-web-app
```

Now navigate to `http://127.0.0.1` and that's it.

## Installing on windows
Only thing that you have to do is to convert unix line endings to windows line endings:
```
git clone https://github.com/aleksaa01/CalendarWebApp.git --config core.autocrlf=input
```
Rest of the commands are the same.

# Preview
![CalendarWebApp installation preview](https://github.com/aleksaa01/CalendarWebApp/blob/master/docs/gifs/CalendarWebApp-installation.gif)
