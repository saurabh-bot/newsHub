import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export default class News extends Component {
        static defaultProps = {
            country: 'in',
            pageSize: 10
        }

        static propTypes = {
            country: PropTypes.string,
            pageSize: PropTypes.number
        }
        constructor(){
            super();
            console.log("Hello I'm a constructor");
            this.state = {
                articles: [],
                loading: false,
                page: 1
            }
;        }

        async componentDidMount() {
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&apiKey=eea62f0fdc704f66b890de73b0acfa28&page=${this.state.page}&pageSize=${this.props.pageSize}`;
            this.setState({loading: true})
            let data = await fetch(url);
            let parsedData = await data.json();
            console.log(parsedData)
            this.setState({
                articles: parsedData.articles,
                 totalResults: parsedData.totalResults,
                 loading: false
                })
        }
        
        handlePrevClick = async () => {
            console.log("prev");

            if(this.state.page<=1) return;

            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&apiKey=eea62f0fdc704f66b890de73b0acfa28&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
            this.setState({loading: true})
            let data = await fetch(url);
            let parsedData = await data.json();
            console.log(parsedData)
            this.setState({
                articles: parsedData.articles,
                page: this.state.page-1,
                loading: false
            })

        }

        handleNextClick = async () => {
            console.log('next');

            if(this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize))return;

            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&apiKey=eea62f0fdc704f66b890de73b0acfa28&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
            this.setState({loading: true})
            let data = await fetch(url);
            let parsedData = await data.json();
            console.log(parsedData)
            this.setState({
                articles: parsedData.articles,
                page: this.state.page+1,
                loading: false
            })
        }
    render() {
        return (
            <div className="container my-3">
                <div className="text-center">
                    <h2>NewsMonkey - Top Headlines</h2>
                </div>
                {this.state.loading && <Spinner/>}
                <div className="row">
                {!this.state.loading && this.state.articles.map((element) => {
                    return <div className="col-md-4" key={element.url}>
                    <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage}
                    newsUrl={element.url}/>
                </div>
                })}  
                </div>
                <div className="container d-flex justify-content-between mt-6">
                    <button disabled={this.state.page<=1} type="button" onClick={this.handlePrevClick} className="btn btn-dark btn-sm">&larr; Previous</button>
                    <button disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" onClick={this.handleNextClick} className="btn btn-dark btn-sm">Next &rarr;</button>
                </div>
            </div>
        )
    }
}
