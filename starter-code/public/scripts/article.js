'use strict';
/* eslint-disable */
function Article (opts) {
  // REVIEW: Convert property assignment to a new pattern. Now, ALL properties of `opts` will be
  // assigned as properies of the newly created article object. We'll talk more about forEach() soon!
  // We need to do this so that our Article objects, created from DB records, will have all of the DB columns as properties (i.e. article_id, author_id...)
  Object.keys(opts).forEach(function(e) {
    this[e] = opts[e]
  }, this);
}

Article.all = [];

// ++++++++++++++++++++++++++++++++++++++

// REVIEW: We will be writing documentation today for the methods in this file that handles Model layer of our application. As an example, here is documentation for Article.prototype.toHtml(). You will provide documentation for the other methods in this file in the same structure as the following example. In addition, where there are TODO comment lines inside of the method, describe what the following code is doing (down to the next TODO) and change the TODO into a DONE when finished.

/**
 * OVERVIEW of Article.prototype.toHtml():
 * - A method on each instance that converts raw article data into HTML
 * - Inputs: nothing passed in; called on an instance of Article (this)
 * - Outputs: HTML of a rendered article template
 */
Article.prototype.toHtml = function() {
  // DONE: Retrieves the  article template from the DOM and passes the template as an argument to the Handlebars compile() method, with the resulting function being stored into a variable called 'template'.
  var template = Handlebars.compile($('#article-template').text());

  // DONE: Creates a property called 'daysAgo' on an Article instance and assigns to it the number value of the days between today and the date of article publication
  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // DONE: Creates a property called 'publishStatus' that will hold one of two possible values: if the article has been published (as indicated by the check box in the form in new.html), it will be the number of days since publication as calculated in the prior line; if the article has not been published and is still a draft, it will set the value of 'publishStatus' to the string '(draft)'
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';

  // DONE: Assigns into this.body the output of calling marked() on this.body, which converts any Markdown formatted text into HTML, and allows existing HTML to pass through unchanged
  this.body = marked(this.body);

// DONE: Output of this method: the instance of Article is passed through the template() function to convert the raw data, whether from a data file or from the input form, into the article template HTML
  return template(this);
};

// ++++++++++++++++++++++++++++++++++++++

// DONE
/**
 * OVERVIEW of
 * - Describe what the method does
 * - Inputs: identify any inputs and their source
 * - Outputs: identify any outputs and their destination
 */
 // This method will take article objects as an input and push them into Article.all in chronological order.
 // input is rows, output is Article.all
Article.loadAll = function(rows) {
  // DONE: describe what the following code is doing
  // sorts the rows according to date
  rows.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  // DONE: describe what the following code is doing
  // push all new articles to .all
  rows.forEach(function(ele) {
    Article.all.push(new Article(ele));
  })
};

// ++++++++++++++++++++++++++++++++++++++

// DONE
/**
 * OVERVIEW of
 * - Describe what the method does
 * - Inputs: identify any inputs and their source
 * - Outputs: identify any outputs and their destination
 */
 // Inputs are the table of "articles" and  data file "hackerIpsum.json".
 // Outputs are article objects instantiated and possible error message if there's an error.
Article.fetchAll = function(callback) {
  // DONE: describe what the following code is doing
  // This will get the table format from the app.get function in server.js
  $.get('/articles')
  // DONE: describe what the following code is doing
  // This "then" function will initiate the functions within its code block that applies to '/articles'
  .then(function(results) {
      if (results.length) { // If records exist in the DB
        // DONE: describe what the following code is doing
        // Load all data from the table if it's not empty
        // and does a callback to check for left over data.
        Article.loadAll(results);
        callback();
      } else { // if NO records exist in the DB
        // DONE: describe what the following code is doing
        // Get data from local file "hackerIpsum.json" if there's no more data in the table
        // and instantiate a new article and insert it in the database.
        $.getJSON('./data/hackerIpsum.json')
        .then(function(rawData) {
          rawData.forEach(function(item) {
            let article = new Article(item);
            article.insertRecord(); // Add each record to the DB
          })
        })
        // DONE: describe what the following code is doing
        // This executes if there is an argument with fetchAll
        .then(function() {
          Article.fetchAll(callback);
        })
        // DONE: describe what the following code is doing
        // If there's an error retrieving data, this will log the error message to the console.
        .catch(function(err) {
          console.error(err);
        });
      }
    }
  )
};

// ++++++++++++++++++++++++++++++++++++++

// DONE
/**
 * OVERVIEW of
 * - Describe what the method does
 * - Inputs: identify any inputs and their source
 * - Outputs: identify any outputs and their destination
 */
 // This method will delete the table
 // Input is the table, output is a none
Article.truncateTable = function(callback) {
  // DONE: describe what the following code is doing
  // This will delete the table
  $.ajax({
    url: '/articles',
    method: 'DELETE',
  })
  // DONE: describe what the following code is doing
  // callback if there is an argument passed by truncateTable
  .then(function(data) {
    console.log(data);
    if (callback) callback();
  });
};

// ++++++++++++++++++++++++++++++++++++++

// DONE
/**
 * OVERVIEW of
 * - Describe what the method does
 * - Inputs: identify any inputs and their source
 * - Outputs: identify any outputs and their destination
 */
 // This method will insert a record into the table.
 // Input is the data to be inserted to the table
 // Output is the console log.
Article.prototype.insertRecord = function(callback) {
  // DONE: describe what the following code is doing
  // this will add another row to the table
  $.post('/articles', {author: this.author, authorUrl: this.authorUrl, body: this.body, category: this.category, publishedOn: this.publishedOn, title: this.title})
  // DONE: describe what the following code is doing
  // This will execute once the insertion is done.
  .then(function(data) {
    console.log(data);
    if (callback) callback();
  })
};

// ++++++++++++++++++++++++++++++++++++++

// DONE
/**
 * OVERVIEW of
 * - Describe what the method does
 * - Inputs: identify any inputs and their source
 * - Outputs: identify any outputs and their destination
 */
 // The purpose of this method is to delete a specific article with the specified ID.
 // Input is an article from the table.
 // Output is console log.
Article.prototype.deleteRecord = function(callback) {
  // DONE: describe what the following code is doing
  // Thi will look for the specific row with the ID and request a deletion of that article.
  $.ajax({
    url: `/articles/${this.article_id}`,
    method: 'DELETE'
  })
  // DONE: describe what the following code is doing
  // This will execute once the deletion is complete and log the data
  .then(function(data) {
    console.log(data);
    if (callback) callback();
  });
};

// ++++++++++++++++++++++++++++++++++++++

// DONE
/**
 * OVERVIEW of
 * - Describe what the method does
 * - Inputs: identify any inputs and their source
 * - Outputs: identify any outputs and their destination
 *
 */
 // The purpose of this method is to updata a specific article with the ID in the table.
 // Input is the table that will be updated
 // Output is none.
Article.prototype.updateRecord = function(callback) {
  // DONE: describe what the following code is doing
  // This will look for specific row with the ID.
  $.ajax({
    url: `/articles/${this.article_id}`,
    method: 'PUT',
    data: {  // DONE: describe what this object is doing
      // This will change the data of the row that was found.
      author: this.author,
      authorUrl: this.authorUrl,
      body: this.body,
      category: this.category,
      publishedOn: this.publishedOn,
      title: this.title
    }
  })
  // DONE: describe what the following code is doing
  // This will log the data that has been updated.
  .then(function(data) {
    console.log(data);
    if (callback) callback();
  });
};
