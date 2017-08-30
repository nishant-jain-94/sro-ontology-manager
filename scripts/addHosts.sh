#!/bin/bash

# Path to host file
ETC_HOSTS=/etc/hosts;

# Default IP for hostname
IP="127.0.0.1";

addhost() 
{
    HOSTNAME=$1;
    echo "$HOSTNAME"
    HOSTS_LINE="$IP\s$HOSTNAME";
    if [ -n "$(grep $HOSTNAME $ETC_HOSTS)" ]
        then 
            echo "$HOSTNAME already exists: $(grep  $HOSTNAME $ETC_HOSTS)";
        else
            echo "Adding $HOSTNAME to your $ETC_HOSTS";
            sudo -- sh -c -e "echo '$HOSTS_LINE' >> $ETC_HOSTS";

            if [ -n "$(grep $HOSTNAME $ETC_HOSTS)" ]
                then
                    echo "$HOSTNAME was added successfully to $ETC_HOSTS";
                else
                    echo "Failed to add $HOSTNAME";
            fi
    fi
}

while read host;
do
    addhost $host;
done < "scripts/hosts";