import { Component, AfterViewInit } from '@angular/core';
import { MapLoaderService } from 'src/app/services/shared/map-loader.service';
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  selectedShape: any;
  selectedColor: any;
  colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
  colorButtons = {};
  map: any;
  drawingManager: any;
  polyOptions: any;
  selectionArea: any;

  constructor(protected mapLoaderService: MapLoaderService) {}

  ngAfterViewInit() {
    this.mapLoaderService.load().then(() => {
      this.drawPolygon();
    });
    // google.maps.event.addListener(this.drawingManager, 'drawingmode_changed', () => {
    //   this.clearSelection();
    // });
    // google.maps.event.addListener(this.map, 'click', () => {
    //   this.clearSelection();
    // });
    console.log(document.getElementById('delete-button'));
    // google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', () => {
    //   this.deleteSelectedShape();
    // });
  }

  drawPolygon() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: new google.maps.LatLng(17.417593, 78.346258),
      zoomControl: true
    });

    const input = document.getElementById('pac-input');
    const searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });

    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log('Returned place contains no geometry');
          return;
        }
        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: this.map,
          icon: {icon},
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });

    this.polyOptions = {
      strokeWeight: 0,
      fillOpacity: 0.45,
      editable: true,
      draggable: true
    };

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      markerOptions: {
        draggable: true
      },
      polylineOptions: {
        editable: true
      },
      rectangleOptions: this.polyOptions,
      circleOptions: this.polyOptions,
      polygonOptions: this.polyOptions,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER
      },
      map: this.map
    });

    this.drawingManager.setMap(this.map);
    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event) => {
        if (event.type === google.maps.drawing.OverlayType.MARKER) {
          // dummy call
        } else {
          // Switch back to non-drawing mode after drawing a shape.
          alert(event.overlay.getPath().getArray());
          this.drawingManager.setDrawingMode(null);
          // Add an event listener that selects the newly-drawn shape when the user
          // mouses down on it.
          const newShape = event.overlay;
          newShape.type = event.type;
          google.maps.event.addListener(newShape, 'click', () => {
            this.setSelection(newShape);
          });
          const area = google.maps.geometry.spherical.computeArea(
            newShape.getPath().getArray()
          );
          this.selectionArea = (area / 10000).toFixed(2);
          this.setSelection(newShape);
        }
      }
    );
  }

  setSelection(shape: any) {
    this.clearSelection();
    this.selectedShape = shape;
    shape.setEditable(true);
    this.selectColor(shape.get('fillColor') || shape.get('strokeColor'));
    google.maps.event.addListener(shape.getPath(), 'set_at', () => {
      this.calcar();
    });
    google.maps.event.addListener(shape.getPath(), 'insert_at', () => {
      this.calcar();
    });
  }

  public calcar() {
    const area = google.maps.geometry.spherical.computeArea(this.selectedShape.getPath().getArray());
    this.selectionArea = (area / 10000).toFixed(2);
  }

  clearSelection() {
    if (this.selectedShape) {
      this.selectedShape.setEditable(false);
      this.selectedShape = null;
    }
  }

  buildColorPalette() {
    const colorPalette = document.getElementById('color-palette');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.colors.length; ++i) {
      const currColor = this.colors[i];
      const colorButton = this.makeColorButton(currColor);
      colorPalette.appendChild(colorButton);
      this.colorButtons[currColor] = colorButton;
    }
    this.selectColor(this.colors[0]);
  }

  setSelectedShapeColor(color: any) {
    if (this.selectedShape) {
      if (this.selectedShape.type === google.maps.drawing.OverlayType.POLYLINE) {
        this.selectedShape.set('strokeColor', color);
      } else {
        this.selectedShape.set('fillColor', color);
      }
    }
  }

  makeColorButton(color: any) {
    const button = document.createElement('span');
    button.className = 'color-button';
    button.style.backgroundColor = color;
    google.maps.event.addDomListener(button, 'click', () => {
      this.selectColor(color);
      this.setSelectedShapeColor(color);
    });
    return button;
  }

  selectColor(color: any) {
    this.selectedColor = color;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.colors.length; ++i) {
      const currColor = this.colors[i];
      this.colorButtons[currColor].style.border =
        currColor === color ? '2px solid #789' : '2px solid #fff';
    }
    // Retrieves the current options from the drawing manager and replaces the
    // stroke or fill color as appropriate.
    const polylineOptions = this.drawingManager.get('polylineOptions');
    polylineOptions.strokeColor = color;
    this.drawingManager.set('polylineOptions', polylineOptions);

    const rectangleOptions = this.drawingManager.get('rectangleOptions');
    rectangleOptions.fillColor = color;
    this.drawingManager.set('rectangleOptions', rectangleOptions);

    const circleOptions = this.drawingManager.get('circleOptions');
    circleOptions.fillColor = color;
    this.drawingManager.set('circleOptions', circleOptions);

    const polygonOptions = this.drawingManager.get('polygonOptions');
    polygonOptions.fillColor = color;
    this.drawingManager.set('polygonOptions', polygonOptions);
  }

  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectionArea = null;
    }
  }
}
