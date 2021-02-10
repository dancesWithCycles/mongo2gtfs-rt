# mongo2gtfs-rt
Convert vehicle positions from Mongo db to the GTFS-Realtime format

## Overview
This repository provides a command line interface service for Linux based operating system. It translates vehilce position documents from a Mongo data base collection to a message feed in the GTFS-Realtime format.

## Setup for development environment
Run the following command in your favorite GNU/Linux shell to instell dependenies.
```
npm i
```
Run the following command in your favorite GNU/Linux shell if you fancy log messages for debugging.
```
export DEBUG=vehpos,mongoose,vehpospb
```
Run the following command in your favorite GNU/Linux shell to start the service.
```
npm run dev
```

