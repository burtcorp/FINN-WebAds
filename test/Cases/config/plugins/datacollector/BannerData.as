﻿package {  import fl.transitions.Tween;  import fl.transitions.easing.*;    import flash.display.Bitmap;  import flash.display.BitmapData;  import flash.display.Loader;  import flash.display.MovieClip;  import flash.events.Event;  import flash.external.ExternalInterface;  import flash.net.URLRequest;  import flash.text.AntiAliasType;  import flash.text.TextField;  import flash.text.TextFormat;  import flash.system.Security;    public class BannerData extends MovieClip {    private var field: TextField 		= new TextField();    private var format: TextFormat 		= new TextFormat();	private var titleField: TextField 	= new TextField();	private var titleFormat: TextFormat = new TextFormat();	private var priceField: TextField 	= new TextField();	private var priceFormat: TextFormat = new TextFormat();			    public function BannerData() {		Security.allowDomain("*");      if (ExternalInterface.available) {        ExternalInterface.call("banner.plugin", "getAdData", '{"customer": 1, "area": 1}', "sendDataBack");        ExternalInterface.addCallback("sendDataBack", ResultHandler);      }      format.size  = 9;	  format.font  = "Monaco";	  field.textColor = 0xCCCCCC;      field.width  = 960;      field.height = 130;	  field.x = 10;      field.y = 120;	  field.antiAliasType = AntiAliasType.ADVANCED;      field.defaultTextFormat = format;      field.text = "Laster...";      addChild(field);	    }    public function ResultHandler( res:Object ):void { 	  if (res.error){		  field.text = "En feil har oppstått: " + res.message; 	  } else {		  var imageLoader:Loader = new Loader();		  imageLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, function(event:Event){			  var image = addChild(imageLoader); 			  var ratio = (130 / image.height);			  image.scaleY = ratio;			  image.scaleX = ratio;			  image.y = 10;			  image.x = stage.width - image.width;			  var t:Tween = new Tween(image, "alpha", Strong.easeIn, 0, 1, 2.5, true);			  			  //heading			  titleFormat.size  = 16;			  titleFormat.font  = "Monaco";			  titleField.wordWrap = true;			  titleField.defaultTextFormat = titleFormat;			  titleField.width = stage.width - image.width;			  titleField.height = 80;			  //titleField.x = 10;			  titleField.y = 10;			  titleField.textColor = 0xFFFFFF;			  titleField.htmlText = res.list[0].heading;			  addChild(titleField);			  var t2:Tween = new Tween(titleField, "x", Strong.easeIn, -100, 10, 2, true);			  var t3:Tween = new Tween(titleField, "alpha", Strong.easeIn, 0, 1, 2.5, true);			  			  //priceSuggestion			  priceFormat.size = 13;			  priceFormat.font = "Monaco";			  priceField.defaultTextFormat = priceFormat;			  priceField.width = 400;			  priceField.height = 50;			  priceField.y = titleField.height + 10;			  priceField.x = 10;			  priceField.textColor = 0xFFFFFF;			  priceField.htmlText = "<b>" + res.list[0].priceSuggestion.label + ":</b> " + res.list[0].priceSuggestion.value;			  addChild(priceField);			  var t4:Tween = new Tween(priceField, "x", Strong.easeIn, -100, 10, 2, true);			  var t5:Tween = new Tween(priceField, "alpha", Strong.easeIn, 0, 1, 2.5, true);			  			  field.text = "Lastet "+res.list[0].mainImage + " ferdig.";		  });		  var imageRequest = new URLRequest(res.list[0].mainImage);		  imageLoader.load(imageRequest);	  }    }		public function getBannerImage(){		}		public function getBannerTitle(){		}		public function resizeContainer(){		}  }}	