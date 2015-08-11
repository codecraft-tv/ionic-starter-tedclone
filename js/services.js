var app = angular.module('tedrssapp.services', []);

app.constant("FEED_URL", "http://feeds.feedburner.com/TEDTalks_video");

app.factory('FeedService', function ($http, $q, FEED_URL) {

	var self = {
		'posts': []
	};

	var parseEntry = function (entry) {
		var media = (entry && entry.mediaGroups) ? entry.mediaGroups[0].contents[0] : {url: ''};
		if (media.type == "video/mp4") {
			entry.thumbnail = media.thumbnails[0].url;
			entry.video = media.url;
		} else {
			entry.thumbnail = media.url;
		}
		entry.publishedDate = new Date(entry.publishedDate);
	};


	self.loadFeed = function () {

		self.posts.length = 0;
		var defer = $q.defer();
		var params = {"v": "1.0", "callback": "JSON_CALLBACK", "num": 100, "q": FEED_URL};

		$http.jsonp("http://ajax.googleapis.com/ajax/services/feed/load", {params: params})
			.success(function (res) {
				console.debug(res);

				angular.forEach(res.responseData.feed.entries, function (entry) {
					parseEntry(entry);
					self.posts.push(entry);
				});
				defer.resolve(self.posts);

			});

		return defer.promise;
	};

	self.getEntry = function (link) {
		for (var i = 0; i < self.posts.length; i++) {
			var entry = self.posts[i];
			if (entry.link == link) {
				return entry;
			}
		}
		return null;
	};

	return self;
});
