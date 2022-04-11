require('dotenv').config();
const express = require('express');
const { graphql } = require('@octokit/graphql');
const graphqlAuth = graphql.defaults({
    headers: { authorization: 'token ' + process.env.GRAPH_KEY },
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/score', (req, res) => {
    graphqlAuth(`query MyQuery {
        organization(login: "cmda-minor-web") {
            name
            repositories(last: 1) {
            edges {
                node {
                name
                forks(first: 100) {
                    edges {
                    node {
                        owner {
                        login
                        }
                        defaultBranchRef {
                        repository {
                            name
                        }
                        target {
                            ... on Commit {
                            history(first: 100) {
                                edges {
                                node {
                                    author {
                                    name
                                    }
                                    message
                                }
                                }
                            }
                            }
                        }
                        }
                    }
                    }
                }
                }
            }
            }
        }
    }`)
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.error(err);
        });
});

app.use((req, res) => {
    res.status(404).render('error404');
});

app.listen(process.env.PORT, () => {
    console.log(`Application started on port: http://localhost:${process.env.PORT}`);
});
