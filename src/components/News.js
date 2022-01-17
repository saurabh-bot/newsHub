import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


export default class News extends Component {
        static defaultProps = {
            country: 'in',
            pageSize: 10,
            category: 'general'
        }

        static propTypes = {
            country: PropTypes.string,
            pageSize: PropTypes.number,
            category: PropTypes.string
        }
        capitalizeFirstLetter = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        constructor(props){
            super(props);
            console.log("Hello I'm a constructor");
            this.state = {
                articles: [],
                loading: true,
                page: 1,
                totalResults: 0
            }
            document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
;        }
        
        async updateNews() {
            console.log(this.state.page);
            this.props.setProgress(10);
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${process.env.REACT_APP_API_KEY}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
            this.setState({loading: true})
            this.props.setProgress(30);
            let data = await fetch(url);
            this.props.setProgress(50);
            let parsedData = await data.json();
            console.log(parsedData)
            this.setState({
                articles: parsedData.articles,
                 totalResults: parsedData.totalResults,
                 loading: false
                })
            this.props.setProgress(100);
            
        }
        async componentDidMount() {
            this.updateNews();
        }
        
        handlePrevClick = async () => {

            if(this.state.page<=1) return;
            await this.setState({page: this.state.page-1});
            this.updateNews();

        }

        handleNextClick = async () => {
            console.log('next');

            if(this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize))return;

            await this.setState({ page: this.state.page + 1 });
            this.updateNews();
        }
        fetchMoreData = async () => {
            console.log(this.state.page);
            this.setState({page: this.state.page+1});
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${process.env.REACT_APP_API_KEY}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
            let data = await fetch(url);
            let parsedData = await data.json();
            console.log(parsedData)
            this.setState({
                articles: this.state.articles.concat(parsedData.articles),
                 totalResults: parsedData.totalResults,
                 loading: false
                })

        }
    render() {
        return (<>
                <div className="text-center" style={{margin: '40px 0px'}}>
                    <h2>NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>
                </div>
                {this.state.loading && <Spinner/>}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner/>}
                >
                <div className="container my-3">
                <div className="row">
                {this.state.articles.map((element) => {
                    return <div className="col-md-4" key={element.url}>
                    <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage}
                    date={element.publishedAt} newsUrl={element.url} source={element.source.name}/>
                </div>
                })}  
                </div>
                </div>
                </InfiniteScroll>
                {/* <div className="container d-flex justify-content-between mt-6">
                    <button disabled={this.state.page<=1} type="button" onClick={this.handlePrevClick} className="btn btn-dark btn-sm">&larr; Previous</button>
                    <button disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" onClick={this.handleNextClick} className="btn btn-dark btn-sm">Next &rarr;</button>
                </div> */}
                </>
        )
    }
}
