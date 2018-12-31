const path = require('path')

const createTagPages = (createPage, posts) => {
  const AllTagsTemplate = path.resolve('src/templates/AllTags/index.js')
  const SingleTagsTemplate = path.resolve('src/templates/SingleTag/index.js')

  const postsByTag = {}

  posts.forEach(({ node }) => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach(tag => {
        if (!postsByTag[tag]) {
          postsByTag[tag] = []
        }

        postsByTag[tag].push(node)
      })
    }
  })

  const tags = Object.keys(postsByTag)

  createPage({
    path: '/tags',
    component: AllTagsTemplate,
    context: {
      tags: tags.sort(),
    },
  })

  tags.forEach(tagName => {
    const posts = postsByTag[tagName]

    createPage({
      path: `/tags/${tagName}`,
      component: SingleTagsTemplate,
      context: {
        posts,
        tagName,
      },
    })
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const BlogPostTemplate = path.resolve('src/templates/BlogPost/index.js')

    //Query for markdown node to use in creating pages
    resolve(
      graphql(`
        {
          allMarkdownRemark(
            sort: { order: ASC, fields: [frontmatter___date] }
          ) {
            edges {
              node {
                frontmatter {
                  path
                  title
                  date
                  excerpt
                  tags
                }
              }
            }
          }
        }
      `).then(result => {
        const posts = result.data.allMarkdownRemark.edges

        if (result.errors) {
          reject(result.errors)
        }

        createTagPages(createPage, posts)

        //Create blog post pages
        posts.forEach(({ node }, index) => {
          createPage({
            path: node.frontmatter.path,
            component: BlogPostTemplate,
            context: {
              pathSlug: node.frontmatter.path,
              prev: index === 0 ? null : posts[index - 1].node,
              next: index === posts.length - 1 ? null : posts[index + 1].node,
            },
          })
        })
      })
    )
  })
}

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
