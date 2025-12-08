#!/bin/bash

# Clean old deployment files before copying
sudo rm -rf /home/ec2-user/app/scripts
sudo rm -f /home/ec2-user/app/Dockerfile
sudo rm -f /home/ec2-user/app/nginx.conf

# recreate scripts folder to prevent errors
sudo mkdir -p /home/ec2-user/app/scripts
sudo chown ec2-user:ec2-user /home/ec2-user/app/scripts
