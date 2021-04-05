# Respite REST API

## HTTP Verbs Used

* GET - retrieves the object
* POST - creates new object
* PUT - modifies exeisting object
* DELETE - deletes object

## DNS

### Objects

#### Must Have

##### Zone

The zone object represents an authoritative DNS Zone (alternately a zone object could also represent forwarding rules in addition to auth zones).

**Path**

* /zones - GET to list all zones, POST to create new zone
* /zone/{zone} - PUT/DELETE to update or delete a zone

**Object Representation**

```json
{
    "zone": string ("bar.foo")
}
```

##### Resource Record Set (RRSet)

An RRSet are all records of same name and type, this means an RRSet is uniquely identified by the zone, name, and record type.

**Path**

* /zone/{zone}/records - GET to list all RRSets in the zone, POST to create new RRSet
* /zone/{zone}/records/{name}/{rtype} - PUT/DELETE to updae or delete an existing RRSet

**Object Representation**

```json
{
    "zone": string ("bar.foo"),
    "name": string ("bar.foo"),
    "type": string ("A"),
    "data": array of array of string ([["1.1.1.1"], ["2.2.2.2"]])
}
```

Optionally, every record type could have its own rdata representation, e.g., for MX records you could have:

```json
{
    "zone": "bar.foo",
    "name": "bar.foo",
    "type": "A",
    "data": [
        {"priority": 10, "host": "mail1.bar.foo"},
        {"priority": 20, "host": "mail2.bar.foo"}
    ]
}
```

#### Should Have

1. Global configs - default TTLs, XFR ACLs, etc.

#### Nice to Have

1. TSIG keys object
2. DNSSEC keys object
3. Zone forward definitions
4. Activity log / audit log
5. DNS Stats
6. Packet logging

## IPAM

### Objects

#### Must Have

##### Network

Networks are objects used to organize all IP space. They also serve to configure DHCP. They act like linked lists with references to their parent and children. 

* Networks are unique to an address and mask
* Overlapping IP space is not possible
* Networks can hold other networks
* Networks are assigned to a DHCP scopegroup simply by having the `dhcp.scopegroup` field populated with a valid DHCP scopegroup name

**Path**

* /networks - GET lists all networks (top level only maybe?), POST creates a new network
* /networks/{network_address}/{network_mask} - GET a specific network, PUT to modify, DELETE to delete

**Object Representation**

```json
{

    "address": string ("192.168.42.0"),
    "mask": int (24),
    "name": string ("New York Office"),
    "parent": string ("192.168.0.0/16"),
    "children": array of string (["192.168.42.0/27", "192.168.42.32/27"]),
    "dhcp": {
        "scopegroup": string ("scopegroup1"),
        "options": array of option objects ([{"nameservers (6)": ["1.1.1.1", "8.8.8.8"]}])
    }
}
```

##### IP

The IP object represents individual addresses and tells the user their state:

* leased
* static
* reserved
* unused

If the address is not in an `unused` state then the API should return all information we know about this host such as:

* MAC address
* Vendor (OUI lookup)
* Lease grant time
* Lease expiry time
* "First seen" time
* All DHCP options assigned to it at time of lease

**Path**

* /networks/{network_address}/{network_mask}/ips - List all IPs in a network, only returns IPs that are not in the `unused` state, POST to create an IP reservation or static definition
* /networks/{network_address}/{network_mask}/ips/{address} - GET returns the IP object, PTU/DELETE modifies / deletes

**Object Representation**

#### Should Have

1. Networks can be deleted and nothing will happen to its children, they will get re-parented
2. Networks can be deleted and given a `recursive=true` query param and all of its children will be deleted
3. DHCP configuration set on a network should inherit to its children

#### Nice to Have

1. Networks can have user defined attributes (kv pairs)

## DHCP

### Objects

#### Must Have

Scopegroup - Scopegroups are unique by unique and addressable by an user defined name
Option - defines all options available for use
Devices (active leases) - basically a filter of all IPs in the `leased` state

##### Scopegroup

Description

**Path**

* 

**Object Representation**

```json
{
}
```

#### Should Have

1. DHCP dynamic pool ranges OR exclusion ranges

#### Nice to Have

1. 
