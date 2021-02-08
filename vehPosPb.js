/*
Copyright (C) 2021  Stefan Begerad

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const Debug = require('debug')('vehpospb');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

// transform JSON collection to encoded GTFS-REALTIME FeedMessage
const VehiclePositionsPb=function(data){
        // create a new array containing protobuf binary data
        var feedHeader = GtfsRealtimeBindings.transit_realtime.FeedHeader.create({
            gtfsRealtimeVersion:'2.0'
        });
        
        const feedEntitys=data.map(item=>{
            var pos = GtfsRealtimeBindings.transit_realtime.Position.create({
                latitude:item.lat,longitude:item.lon});
            
            var vehiclePosition = GtfsRealtimeBindings.transit_realtime.VehiclePosition.create({
            position:pos});
            
            var feedEntity = GtfsRealtimeBindings.transit_realtime.FeedEntity.create({
                id:item.uuid,vehicle:vehiclePosition
            });
            
            return feedEntity;
        })

        var feedMessage = GtfsRealtimeBindings.transit_realtime.FeedMessage.create({
            header:feedHeader,
            entity:feedEntitys
        });
        
        var errMsg = GtfsRealtimeBindings.transit_realtime.FeedMessage.verify(feedMessage);
        if (errMsg){
            Debug('feedMessage invalid')
            throw Error(errMsg);
        }else{
            Debug('feedMessage valid')
        }
        
        Debug("JSON: %sconsole", JSON.stringify(feedMessage));
        
        var encodedFeedMsg = GtfsRealtimeBindings.transit_realtime.FeedMessage.encode(feedMessage).finish();
        Debug('feedMessage encoded')
        Debug(encodedFeedMsg)
    
    return encodedFeedMsg;
}

module.exports=VehiclePositionsPb;
