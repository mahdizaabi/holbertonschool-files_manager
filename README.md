holbertonschool-files_manager

parentfolder: 60bc2d5fdec8de544a1ef116
token: 3dbe9412-ecfe-46be-bab1-33b2cff41cb6

#Authenticate: 
curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""

#GET ALL FILES
curl -XGET 0.0.0.0:5000/files -H "X-Token: 3dbe9412-ecfe-46be-bab1-33b2cff41cb6" ; echo ""

#GET FILE ASSOCIATED TO PARENT ID:
curl -XGET 0.0.0.0:5000/files?parentId=60bc2d5fdec8de544a1ef116 -H "X-Token: 3dbe9412-ecfe-46be-bab1-33b2cff41cb6" ; echo ""

#READ A PICTURE A SAVE IT INSIDE A PARENT FOLDER:
python3 image_upload.py image.png 3dbe9412-ecfe-46be-bab1-33b2cff41cb6 60bc2d5fdec8de544a1ef116



-adresse already in use:
sudo kill -9 `sudo lsof -t -i:5000`